#!/usr/bin/env node

// src/cli/main.ts
import { spawn } from "node:child_process";
import { copyFileSync, existsSync, rmSync, writeFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

// src/core/html.ts
var escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function scriptSafeJson(value) {
  const LS = String.fromCharCode(8232);
  const PS = String.fromCharCode(8233);
  return JSON.stringify(value).replace(/</g, "\\u003c").split(LS).join("\\u2028").split(PS).join("\\u2029");
}
function traceToHtml(trace, playerJs, theme = "auto") {
  const title = trace.meta.title ?? "Trace";
  return `<!doctype html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="traceplay">
<title>${escapeHtml(title)} \xB7 traceplay</title>
<style>
html{color-scheme:light dark}
body{margin:0;padding:24px;background:#fbfaf7}
@media (prefers-color-scheme:dark){html[data-theme=auto] body{background:#141412}}
html[data-theme=dark] body{background:#141412}
#app{max-width:1120px;margin:0 auto}
@media (max-width:640px){body{padding:12px}}
</style>
</head>
<body>
<div id="app"></div>
<script id="traceplay-data" type="application/json">${scriptSafeJson(trace)}</script>
<script>${playerJs.replace(/<\/script/gi, "<\\/script")}</script>
</body>
</html>
`;
}

// src/core/trace.ts
var TONES = [
  "active",
  "compare",
  "swap",
  "done",
  "visited",
  "frontier",
  "path",
  "found",
  "muted",
  "error",
  "pivot"
];
var MAX_FRAMES = 5e3;
var TraceError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "TraceError";
  }
};
var clone = (value) => JSON.parse(JSON.stringify(value));
var Tracer = class {
  structs = [];
  frames = [];
  caption = "";
  currentLine;
  paused = 0;
  /** Narration shown under the animation until the next say(). */
  say(text) {
    this.caption = String(text);
  }
  /** Highlight a line of meta.code (1-based) from the next frame on. */
  line(n) {
    this.currentLine = n;
  }
  /** Record a frame explicitly, optionally with a new caption. */
  step(caption) {
    if (caption !== void 0) this.caption = String(caption);
    this.record("");
  }
  /** Run several changes as one frame. */
  batch(fn, event = "") {
    this.paused++;
    try {
      fn();
    } finally {
      this.paused--;
    }
    this.record(event);
  }
  array(name, values, options = {}) {
    const numeric = values.every((v) => typeof v === "number");
    const state = {
      kind: "array",
      name,
      style: options.style ?? (numeric && values.length > 1 ? "bars" : "cells"),
      items: values.map((value, i) => ({ key: `${name}#${i}`, value })),
      marks: {},
      pointers: []
    };
    const arr = new TrackedArray(this, state);
    this.register(state, () => arr.clearTransient());
    this.record(`create ${name}`);
    return arr;
  }
  grid(name, cells) {
    const state = { kind: "grid", name, cells: clone(cells), marks: {}, pointers: [] };
    const grid = new TrackedGrid(this, state);
    this.register(state, () => grid.clearTransient());
    this.record(`create ${name}`);
    return grid;
  }
  graph(name, spec) {
    const nodes = spec.nodes.map(
      (n) => typeof n === "string" ? { id: n, label: n } : { id: n.id, label: n.label ?? n.id, x: n.x, y: n.y }
    );
    const ids = new Set(nodes.map((n) => n.id));
    const edges = (spec.edges ?? []).map((e) => {
      const edge = Array.isArray(e) ? { from: e[0], to: e[1], weight: e[2] } : e;
      if (!ids.has(edge.from) || !ids.has(edge.to)) {
        throw new TraceError(
          `Edge ${edge.from} \u2192 ${edge.to} refers to a node that is not in ${name}.`
        );
      }
      return edge.weight === void 0 ? { from: edge.from, to: edge.to } : edge;
    });
    const manual = nodes.every((n) => typeof n.x === "number" && typeof n.y === "number");
    const state = {
      kind: "graph",
      name,
      directed: spec.directed ?? false,
      layout: spec.layout ?? (manual ? "manual" : nodes.length <= 10 ? "circle" : "force"),
      nodes,
      edges,
      nodeMarks: {},
      edgeMarks: {},
      nodeBadges: {}
    };
    const graph = new TrackedGraph(this, state);
    this.register(state, () => graph.clearTransient());
    this.record(`create ${name}`);
    return graph;
  }
  tree(name, options = {}) {
    const state = {
      kind: "tree",
      name,
      binary: options.binary ?? true,
      root: null,
      nodes: {},
      marks: {}
    };
    const tree = new TrackedTree(this, state);
    this.register(state, () => tree.clearTransient());
    this.record(`create ${name}`);
    return tree;
  }
  vars(name, values = {}) {
    const state = { kind: "vars", name, values: { ...values }, changed: [] };
    const vars = new TrackedVars(this, state);
    this.register(state, () => {
      state.changed = [];
    });
    this.record(`create ${name}`);
    return vars;
  }
  /** @internal */
  record(event) {
    if (this.paused > 0) return;
    if (this.frames.length >= MAX_FRAMES) {
      throw new TraceError(
        `More than ${MAX_FRAMES} frames. Trace a smaller input, or group changes with t.batch().`
      );
    }
    this.frames.push({
      structs: this.structs.map((s) => clone(s.state)),
      caption: this.caption,
      event,
      ...this.currentLine !== void 0 ? { line: this.currentLine } : {}
    });
    for (const s of this.structs) s.transient();
  }
  register(state, transient) {
    if (this.structs.some((s) => s.state.name === state.name)) {
      throw new TraceError(`A structure named "${state.name}" already exists.`);
    }
    this.structs.push({ state, transient });
  }
  /** @internal */
  result(meta) {
    const last = this.frames[this.frames.length - 1];
    if (last && (last.caption !== this.caption || last.line !== this.currentLine)) this.record("");
    return { version: 1, meta: { ...meta }, frames: this.frames };
  }
};
function checkTone(tone) {
  if (!TONES.includes(tone)) {
    throw new TraceError(`Unknown tone "${tone}". Use one of: ${TONES.join(", ")}.`);
  }
  return tone;
}
function fmt(v) {
  return typeof v === "string" ? JSON.stringify(v) : String(v);
}
var TrackedArray = class {
  constructor(t, state) {
    this.t = t;
    this.state = state;
    this.nextKey = state.items.length;
  }
  t;
  state;
  transient = [];
  nextKey;
  get length() {
    return this.state.items.length;
  }
  /** Current values (a copy). */
  values() {
    return this.state.items.map((i) => i.value);
  }
  get(i) {
    return this.item(i).value;
  }
  set(i, value) {
    this.item(i).value = value;
    this.flash(i, "active");
    this.t.record(`${this.state.name}[${i}] = ${fmt(value)}`);
  }
  swap(i, j) {
    const a = this.item(i);
    const b = this.item(j);
    this.state.items[i] = b;
    this.state.items[j] = a;
    this.flash(i, "swap");
    this.flash(j, "swap");
    this.t.record(`swap ${this.state.name}[${i}] and ${this.state.name}[${j}]`);
  }
  compare(i, j) {
    this.item(i);
    this.item(j);
    this.flash(i, "compare");
    this.flash(j, "compare");
    this.t.record(`compare ${this.state.name}[${i}] and ${this.state.name}[${j}]`);
  }
  /** Highlight one index for a single frame. */
  focus(i, tone = "active") {
    this.item(i);
    this.flash(i, checkTone(tone));
    this.t.record(`look at ${this.state.name}[${i}]`);
  }
  /** Persistent mark (until unmark). */
  mark(i, tone = "active") {
    const list = Array.isArray(i) ? i : [i];
    for (const idx of list) {
      this.item(idx);
      this.state.marks[idx] = checkTone(tone);
    }
    this.t.record(`mark ${this.state.name}[${list.join(", ")}] ${tone}`);
  }
  unmark(i) {
    if (i === void 0) this.state.marks = {};
    else for (const idx of Array.isArray(i) ? i : [i]) delete this.state.marks[idx];
    this.t.record("");
  }
  /** Show a labelled pointer under an index; pass null to remove it. */
  pointer(name, index) {
    this.state.pointers = this.state.pointers.filter((p) => p.name !== name);
    if (index !== null) {
      if (index < 0 || index > this.state.items.length) {
        throw new TraceError(
          `Pointer ${name}=${index} is outside ${this.state.name} (length ${this.length}).`
        );
      }
      this.state.pointers.push({ name, index });
    }
    this.t.record(index === null ? "" : `${name} = ${index}`);
  }
  push(value) {
    this.state.items.push({ key: `${this.state.name}#${this.nextKey++}`, value });
    this.flash(this.state.items.length - 1, "active");
    this.t.record(`push ${fmt(value)}`);
  }
  pop() {
    const item = this.state.items.pop();
    if (!item) throw new TraceError(`pop() on empty ${this.state.name}.`);
    this.t.record(`pop ${fmt(item.value)}`);
    return item.value;
  }
  unshift(value) {
    this.state.items.unshift({ key: `${this.state.name}#${this.nextKey++}`, value });
    this.shiftMarks(1);
    this.flash(0, "active");
    this.t.record(`unshift ${fmt(value)}`);
  }
  shift() {
    const item = this.state.items.shift();
    if (!item) throw new TraceError(`shift() on empty ${this.state.name}.`);
    this.shiftMarks(-1);
    this.t.record(`shift ${fmt(item.value)}`);
    return item.value;
  }
  shiftMarks(by) {
    const next = {};
    for (const [k, v] of Object.entries(this.state.marks)) {
      const idx = Number(k) + by;
      if (idx >= 0) next[idx] = v;
    }
    this.state.marks = next;
  }
  item(i) {
    const item = this.state.items[i];
    if (!item) {
      throw new TraceError(
        `Index ${i} is outside ${this.state.name} (length ${this.state.items.length}).`
      );
    }
    return item;
  }
  saved = {};
  flash(i, tone) {
    if (!(i in this.saved)) this.saved[i] = this.state.marks[i];
    this.state.marks[i] = tone;
    this.transient.push(i);
  }
  /** @internal */
  clearTransient() {
    for (const i of this.transient) {
      const prev = this.saved[i];
      if (prev === void 0) delete this.state.marks[i];
      else this.state.marks[i] = prev;
    }
    this.transient = [];
    this.saved = {};
  }
};
var TrackedGrid = class {
  constructor(t, state) {
    this.t = t;
    this.state = state;
  }
  t;
  state;
  transient = [];
  saved = {};
  get rows() {
    return this.state.cells.length;
  }
  get cols() {
    return this.state.cells[0]?.length ?? 0;
  }
  get(r, c) {
    this.check(r, c);
    return this.state.cells[r][c];
  }
  set(r, c, value) {
    this.check(r, c);
    this.state.cells[r][c] = value;
    this.flash(r, c, "active");
    this.t.record(`${this.state.name}[${r}][${c}] = ${fmt(value)}`);
  }
  mark(r, c, tone = "active") {
    this.check(r, c);
    this.state.marks[`${r},${c}`] = checkTone(tone);
    this.t.record(`mark (${r}, ${c}) ${tone}`);
  }
  unmark(r, c) {
    if (r === void 0 || c === void 0) this.state.marks = {};
    else delete this.state.marks[`${r},${c}`];
    this.t.record("");
  }
  focus(r, c, tone = "active") {
    this.check(r, c);
    this.flash(r, c, checkTone(tone));
    this.t.record(`look at (${r}, ${c})`);
  }
  pointer(name, r, c) {
    this.state.pointers = this.state.pointers.filter((p) => p.name !== name);
    if (r !== null && c !== void 0) {
      this.check(r, c);
      this.state.pointers.push({ name, row: r, col: c });
    }
    this.t.record(r === null ? "" : `${name} at (${r}, ${c})`);
  }
  check(r, c) {
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) {
      throw new TraceError(
        `Cell (${r}, ${c}) is outside ${this.state.name} (${this.rows}\xD7${this.cols}).`
      );
    }
  }
  flash(r, c, tone) {
    const k = `${r},${c}`;
    if (!(k in this.saved)) this.saved[k] = this.state.marks[k];
    this.state.marks[k] = tone;
    this.transient.push(k);
  }
  /** @internal */
  clearTransient() {
    for (const k of this.transient) {
      const prev = this.saved[k];
      if (prev === void 0) delete this.state.marks[k];
      else this.state.marks[k] = prev;
    }
    this.transient = [];
    this.saved = {};
  }
};
var edgeKey = (from, to) => `${from}->${to}`;
var TrackedGraph = class {
  constructor(t, state) {
    this.t = t;
    this.state = state;
  }
  t;
  state;
  transient = [];
  neighbors(id) {
    this.node(id);
    const out = [];
    for (const e of this.state.edges) {
      if (e.from === id) out.push(e.to);
      else if (!this.state.directed && e.to === id) out.push(e.from);
    }
    return out;
  }
  weight(from, to) {
    return this.edge(from, to).weight;
  }
  mark(id, tone = "active") {
    this.node(id);
    this.state.nodeMarks[id] = checkTone(tone);
    this.t.record(`${id}: ${tone}`);
  }
  unmark(id) {
    if (id === void 0) this.state.nodeMarks = {};
    else delete this.state.nodeMarks[id];
    this.t.record("");
  }
  focus(id, tone = "active") {
    this.node(id);
    this.transient.push({ kind: "node", key: id, prev: this.state.nodeMarks[id] });
    this.state.nodeMarks[id] = checkTone(tone);
    this.t.record(`look at ${id}`);
  }
  markEdge(from, to, tone = "active") {
    const e = this.edge(from, to);
    this.state.edgeMarks[edgeKey(e.from, e.to)] = checkTone(tone);
    this.t.record(`edge ${from}\u2013${to}: ${tone}`);
  }
  focusEdge(from, to, tone = "active") {
    const e = this.edge(from, to);
    const key = edgeKey(e.from, e.to);
    this.transient.push({ kind: "edge", key, prev: this.state.edgeMarks[key] });
    this.state.edgeMarks[key] = checkTone(tone);
    this.t.record(`follow ${from} \u2192 ${to}`);
  }
  /** A small label next to a node, e.g. a distance. Pass null to clear. */
  badge(id, value) {
    this.node(id);
    if (value === null) delete this.state.nodeBadges[id];
    else this.state.nodeBadges[id] = value;
    this.t.record(value === null ? "" : `${id} = ${fmt(value)}`);
  }
  node(id) {
    const n = this.state.nodes.find((x) => x.id === id);
    if (!n) throw new TraceError(`No node "${id}" in ${this.state.name}.`);
    return n;
  }
  edge(from, to) {
    const e = this.state.edges.find(
      (x) => x.from === from && x.to === to || !this.state.directed && x.from === to && x.to === from
    );
    if (!e) throw new TraceError(`No edge ${from} \u2192 ${to} in ${this.state.name}.`);
    return e;
  }
  /** @internal */
  clearTransient() {
    for (const item of this.transient.reverse()) {
      const marks = item.kind === "node" ? this.state.nodeMarks : this.state.edgeMarks;
      if (item.prev === void 0) delete marks[item.key];
      else marks[item.key] = item.prev;
    }
    this.transient = [];
  }
};
var TrackedTree = class {
  constructor(t, state) {
    this.t = t;
    this.state = state;
  }
  t;
  state;
  counter = 0;
  transient = [];
  get root() {
    return this.state.root;
  }
  value(id) {
    return this.node(id).value;
  }
  /** Child ids: [left, right] for binary trees (null when empty). */
  children(id) {
    return [...this.node(id).children];
  }
  left(id) {
    return this.node(id).children[0] ?? null;
  }
  right(id) {
    return this.node(id).children[1] ?? null;
  }
  parent(id) {
    for (const n of Object.values(this.state.nodes)) if (n.children.includes(id)) return n.id;
    return null;
  }
  /** Create the root (replacing any existing tree). Returns its id. */
  setRoot(value) {
    const id = this.newId();
    this.state.nodes = { [id]: { id, value, children: this.state.binary ? [null, null] : [] } };
    this.state.root = id;
    this.t.record(`root ${fmt(value)}`);
    return id;
  }
  /**
   * Add a child. Binary trees take side 'left' | 'right'; general trees append.
   * Returns the new node's id.
   */
  add(parentId, value, side) {
    const parent = this.node(parentId);
    const slot = !this.state.binary ? -1 : side === "right" ? 1 : side === "left" ? 0 : -2;
    if (slot === -2)
      throw new TraceError('Binary trees need a side: add(parent, value, "left" | "right").');
    if (slot >= 0 && parent.children[slot]) {
      throw new TraceError(`Node ${fmt(parent.value)} already has a ${side} child.`);
    }
    const id = this.newId();
    this.state.nodes[id] = { id, value, children: this.state.binary ? [null, null] : [] };
    if (slot >= 0) parent.children[slot] = id;
    else parent.children.push(id);
    this.transient.push({ id, prev: this.state.marks[id] });
    this.state.marks[id] = "active";
    this.t.record(`add ${fmt(value)} under ${fmt(parent.value)}`);
    return id;
  }
  setValue(id, value) {
    this.node(id).value = value;
    this.transient.push({ id, prev: this.state.marks[id] });
    this.state.marks[id] = "active";
    this.t.record(`set ${fmt(value)}`);
  }
  /** Remove a node and its subtree. */
  remove(id) {
    const parentId = this.parent(id);
    const drop = (nid) => {
      const n = this.state.nodes[nid];
      if (!n) return;
      for (const c of n.children) if (c) drop(c);
      delete this.state.nodes[nid];
      delete this.state.marks[nid];
    };
    if (parentId) {
      const p = this.node(parentId);
      p.children = p.children.map((c) => c === id ? null : c);
      if (!this.state.binary) p.children = p.children.filter((c) => c !== null);
    } else if (this.state.root === id) {
      this.state.root = null;
    }
    drop(id);
    this.t.record("remove");
  }
  /**
   * Move a node (with its subtree) under a new parent, or make it the root (parentId null).
   * Rotations are a few attach() calls inside t.batch().
   */
  attach(id, parentId, side) {
    this.node(id);
    const old = this.parent(id);
    if (old) {
      const p = this.node(old);
      p.children = p.children.map((c) => c === id ? null : c);
      if (!this.state.binary) p.children = p.children.filter((c) => c !== null);
    }
    if (parentId === null) {
      this.state.root = id;
    } else {
      const p = this.node(parentId);
      if (this.state.binary) {
        const slot = side === "right" ? 1 : 0;
        p.children[slot] = id;
      } else {
        p.children.push(id);
      }
    }
    this.t.record("move subtree");
  }
  /** Detach a child slot without deleting the subtree (used inside rotations). */
  detach(parentId, side) {
    const p = this.node(parentId);
    const slot = side === "right" ? 1 : 0;
    const child = p.children[slot] ?? null;
    p.children[slot] = null;
    this.t.record("");
    return child;
  }
  mark(id, tone = "active") {
    this.node(id);
    this.state.marks[id] = checkTone(tone);
    this.t.record(`${fmt(this.node(id).value)}: ${tone}`);
  }
  unmark(id) {
    if (id === void 0) this.state.marks = {};
    else delete this.state.marks[id];
    this.t.record("");
  }
  focus(id, tone = "active") {
    this.node(id);
    this.transient.push({ id, prev: this.state.marks[id] });
    this.state.marks[id] = checkTone(tone);
    this.t.record(`visit ${fmt(this.node(id).value)}`);
  }
  newId() {
    return `${this.state.name}:${this.counter++}`;
  }
  node(id) {
    const n = this.state.nodes[id];
    if (!n) throw new TraceError(`No node "${id}" in ${this.state.name}.`);
    return n;
  }
  /** @internal */
  clearTransient() {
    for (const item of this.transient.reverse()) {
      if (!this.state.nodes[item.id]) continue;
      if (item.prev === void 0) delete this.state.marks[item.id];
      else this.state.marks[item.id] = item.prev;
    }
    this.transient = [];
  }
};
var TrackedVars = class {
  constructor(t, state) {
    this.t = t;
    this.state = state;
  }
  t;
  state;
  get(name) {
    return this.state.values[name] ?? null;
  }
  set(nameOrValues, value) {
    const updates = typeof nameOrValues === "string" ? { [nameOrValues]: value ?? null } : nameOrValues;
    Object.assign(this.state.values, updates);
    this.state.changed = Object.keys(updates);
    this.t.record(
      Object.entries(updates).map(([k, v]) => `${k} = ${fmt(v)}`).join(", ")
    );
  }
};
function runTrace(fn, meta = {}) {
  const t = new Tracer();
  fn(t);
  const trace = t.result(meta);
  if (trace.frames.length === 0) throw new TraceError("The trace recorded no frames.");
  return trace;
}

// src/core/module.ts
function toTraceModule(mod) {
  if (typeof mod.default !== "function") {
    throw new TraceError("The default export must be a function that receives `t`.");
  }
  const meta = mod.meta && typeof mod.meta === "object" ? mod.meta : {};
  return { meta, fn: mod.default };
}

// src/core/version.ts
var VERSION = "1.0.0";

// src/cli/main.ts
var HELP = `traceplay ${VERSION}
Turn an algorithm into an interactive step-by-step animation of a real execution.

Usage
  traceplay render <file.trace.js> [-o out.html] [--theme light|dark|auto] [--json] [--open]
  traceplay check  <file.trace.js>
  traceplay init   [name] [--template array|graph|grid|tree]
  traceplay docs

Commands
  render   Run the trace and write a self-contained HTML player (or JSON with --json)
  check    Run the trace and report frames, structures, narration and code coverage
  init     Create a starter <name>.trace.js
  docs     Print the API reference

Examples
  npx github:feresbr1/traceplay init bubble-sort
  npx github:feresbr1/traceplay check bubble-sort.trace.js
  npx github:feresbr1/traceplay render bubble-sort.trace.js --open
`;
async function main(argv, assets) {
  const [command, ...rest] = argv;
  if (!command || command === "-h" || command === "--help" || command === "help") {
    process.stdout.write(HELP);
    return command ? 0 : 2;
  }
  if (command === "-v" || command === "--version") {
    process.stdout.write(`${VERSION}
`);
    return 0;
  }
  let parsed;
  try {
    parsed = parseArgs({
      args: rest,
      allowPositionals: true,
      options: {
        output: { type: "string", short: "o" },
        theme: { type: "string" },
        json: { type: "boolean" },
        open: { type: "boolean" },
        template: { type: "string", short: "t" }
      }
    });
  } catch (error) {
    return fail(`${error.message}
Run traceplay --help for usage.`);
  }
  const { values, positionals } = parsed;
  switch (command) {
    case "docs":
      process.stdout.write(assets.reference);
      return 0;
    case "init":
      return init(positionals[0] ?? "my-algorithm", values.template ?? "array");
    case "check":
    case "render": {
      const file = positionals[0];
      if (!file) return fail(`Usage: traceplay ${command} <file.trace.js>`);
      const loaded = await load(file);
      if ("error" in loaded) return fail(loaded.error);
      const { trace } = loaded;
      if (command === "check") {
        process.stdout.write(summary(trace, file));
        return 0;
      }
      const theme = values.theme ?? "auto";
      if (!["light", "dark", "auto"].includes(theme))
        return fail("--theme must be light, dark or auto.");
      const base = basename(file).replace(/\.trace\.[cm]?js$|\.[cm]?js$/, "");
      const out = resolve(values.output ?? `${base}.${values.json ? "json" : "html"}`);
      const content = values.json ? `${JSON.stringify(trace)}
` : traceToHtml(trace, assets.playerJs, theme);
      writeFileSync(out, content);
      process.stdout.write(
        `\u2714 ${trace.frames.length} steps \u2192 ${out} (${(Buffer.byteLength(content) / 1024).toFixed(0)} KB)
`
      );
      if (values.open && !values.json) openFile(out);
      return 0;
    }
    default:
      return fail(`Unknown command "${command}". Run traceplay --help.`);
  }
}
function fail(message) {
  process.stderr.write(`traceplay: ${message}
`);
  return 1;
}
async function load(file) {
  const path = resolve(file);
  if (!existsSync(path)) return { error: `File not found: ${file}` };
  let mod;
  try {
    mod = await importTrace(path);
  } catch (error) {
    const e = error;
    return { error: `Could not load ${file}: ${e.message}` };
  }
  try {
    const { meta, fn } = toTraceModule(mod);
    return { trace: runTrace(fn, meta) };
  } catch (error) {
    const e = error;
    const where = /\.trace\.[cm]?js[^:]*:(\d+):(\d+)/.exec(e.stack ?? "");
    return { error: `${e.message}${where ? ` (${basename(file)}:${where[1]})` : ""}` };
  }
}
var ESM_SYNTAX = /Cannot use import statement|Unexpected token 'export'|exports is not defined in ES module/;
async function importTrace(path) {
  try {
    return await import(`${pathToFileURL(path).href}?t=${Date.now()}`);
  } catch (error) {
    if (!ESM_SYNTAX.test(error.message) || path.endsWith(".mjs")) throw error;
  }
  const stem = path.slice(0, path.length - extname(path).length);
  const copy = `${stem}.traceplay-${process.pid}.mjs`;
  copyFileSync(path, copy);
  try {
    return await import(pathToFileURL(copy).href);
  } finally {
    rmSync(copy, { force: true });
  }
}
function summary(trace, file) {
  const frames = trace.frames;
  const last = frames[frames.length - 1];
  const kinds = last.structs.map((s) => `${s.name} (${s.kind})`);
  const captions = new Set(frames.map((f) => f.caption).filter(Boolean));
  const codeLines = (trace.meta.code ?? "").split("\n").length;
  const usedLines = new Set(frames.map((f) => f.line).filter((l) => l !== void 0));
  const warnings = [];
  if (!trace.meta.title) warnings.push("meta.title is missing.");
  if (!trace.meta.code) warnings.push("meta.code is missing: the player will not show the source.");
  if (trace.meta.code && usedLines.size === 0)
    warnings.push("meta.code is set but t.line() is never called.");
  const outOfRange = [...usedLines].filter((l) => l < 1 || l > codeLines);
  if (trace.meta.code && outOfRange.length)
    warnings.push(`t.line() points past the end of meta.code: ${outOfRange.join(", ")}.`);
  if (captions.size === 0) warnings.push("No narration: add t.say() at the key moments.");
  if (frames.length < 5) warnings.push("Very few frames: does the trace run the whole algorithm?");
  if (frames.length > 1500)
    warnings.push(`${frames.length} frames is a lot to watch: use a smaller input or t.batch().`);
  const lines = [
    `${trace.meta.title ?? basename(file)}`,
    `  frames      ${frames.length}`,
    `  structures  ${kinds.join(", ") || "none"}`,
    `  narration   ${captions.size} distinct captions`,
    trace.meta.code ? `  code lines  ${usedLines.size} of ${codeLines} highlighted` : "  code lines  (no meta.code)",
    `  last step   ${last.caption || last.event || "(no caption)"}`
  ];
  if (warnings.length) lines.push("", ...warnings.map((w) => `  ! ${w}`));
  else lines.push("", "  \u2714 looks good");
  return `${lines.join("\n")}
`;
}
var TEMPLATES = {
  array: `export const meta = {
  title: 'Bubble sort',
  description: 'Repeatedly swap neighbours that are out of order.',
  code: \`function bubbleSort(a) {
  for (let end = a.length - 1; end > 0; end--) {
    for (let i = 0; i < end; i++) {
      if (a[i] > a[i + 1]) [a[i], a[i + 1]] = [a[i + 1], a[i]];
    }
  }
}\`,
};

export default function (t) {
  const a = t.array('a', [6, 2, 9, 4, 1, 7]);
  for (let end = a.length - 1; end > 0; end--) {
    t.line(2);
    t.say(\`Bubble the largest of a[0..\${end}] to the end.\`);
    for (let i = 0; i < end; i++) {
      t.line(3);
      a.compare(i, i + 1);
      t.line(4);
      if (a.get(i) > a.get(i + 1)) a.swap(i, i + 1);
    }
    a.mark(end, 'done');
  }
  a.mark(0, 'done');
  t.say('Sorted.');
  t.step();
}
`,
  graph: `export const meta = { title: 'Depth-first search', description: 'Go as deep as possible before backtracking.' };

export default function (t) {
  const g = t.graph('g', {
    nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'E'], ['E', 'F'], ['D', 'F']],
  });
  const seen = new Set();
  const visit = (id) => {
    seen.add(id);
    t.say(\`Visit \${id}.\`);
    g.mark(id, 'visited');
    for (const next of g.neighbors(id)) {
      if (seen.has(next)) continue;
      g.markEdge(id, next, 'path');
      visit(next);
    }
    g.mark(id, 'done');
  };
  visit('A');
}
`,
  grid: `export const meta = { title: 'Flood fill', description: 'Paint every connected open cell starting from one cell.' };

export default function (t) {
  const g = t.grid('image', [
    ['', '', '#', '', ''],
    ['', '#', '#', '', ''],
    ['', '', '', '#', ''],
    ['#', '#', '', '#', ''],
  ]);
  const stack = [[0, 0]];
  t.say('Fill from the top-left corner.');
  while (stack.length) {
    const [r, c] = stack.pop();
    if (r < 0 || c < 0 || r >= g.rows || c >= g.cols || g.get(r, c) !== '') continue;
    g.set(r, c, '\xB7');
    g.mark(r, c, 'visited');
    stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
  }
  t.say('Filled.');
  t.step();
}
`,
  tree: `export const meta = { title: 'Binary tree in-order traversal', description: 'Left subtree, node, right subtree.' };

export default function (t) {
  const tree = t.tree('tree');
  const root = tree.setRoot(8);
  const l = tree.add(root, 4, 'left');
  const r = tree.add(root, 12, 'right');
  tree.add(l, 2, 'left');
  tree.add(l, 6, 'right');
  tree.add(r, 10, 'left');
  const out = t.array('output', [], { style: 'cells' });
  const walk = (id) => {
    if (!id) return;
    walk(tree.left(id));
    tree.mark(id, 'visited');
    out.push(tree.value(id));
    walk(tree.right(id));
  };
  t.say('Visit left, then node, then right: the values come out sorted.');
  walk(root);
}
`
};
function init(name, template) {
  const source = TEMPLATES[template];
  if (!source) return fail(`--template must be one of ${Object.keys(TEMPLATES).join(", ")}.`);
  const file = resolve(name.endsWith(".js") ? name : `${name}.trace.js`);
  if (existsSync(file)) return fail(`${basename(file)} already exists.`);
  writeFileSync(file, source);
  process.stdout.write(
    `\u2714 Created ${basename(file)}. Next: traceplay render ${basename(file)} --open
`
  );
  return 0;
}
function openFile(path) {
  const [cmd, args] = process.platform === "win32" ? ["cmd", ["/c", "start", '""', path]] : process.platform === "darwin" ? ["open", [path]] : ["xdg-open", [path]];
  try {
    spawn(cmd, args, { stdio: "ignore", detached: true }).unref();
  } catch {
  }
}

// src/cli/index.ts
process.removeAllListeners("warning");
process.on("warning", (warning) => {
  if (warning.code === "MODULE_TYPELESS_PACKAGE_JSON") return;
  if (/^To load an ES module/.test(warning.message)) return;
  process.stderr.write(`${warning.name}: ${warning.message}
`);
});
main(process.argv.slice(2), { playerJs: '"use strict";(()=>{var Yt=Object.create;var Xe=Object.defineProperty;var Zt=Object.getOwnPropertyDescriptor;var Qt=Object.getOwnPropertyNames;var en=Object.getPrototypeOf,tn=Object.prototype.hasOwnProperty;var nn=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(n){throw t=0,n}};var rn=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Qt(t))!tn.call(e,o)&&o!==n&&Xe(e,o,{get:()=>t[o],enumerable:!(r=Zt(t,o))||r.enumerable});return e};var on=(e,t,n)=>(n=e!=null?Yt(en(e)):{},rn(t||!e||!e.__esModule?Xe(n,"default",{value:e,enumerable:!0}):n,e));var Ut=nn(qe=>{var Tt=Object.defineProperty,gn=e=>Tt(e,"__esModule",{value:!0}),bn=(e,t)=>{for(var n in t)Tt(e,n,{get:t[n],enumerable:!0})};gn(qe);bn(qe,{GIFEncoder:()=>Ft,applyPalette:()=>Pn,default:()=>Rn,nearestColor:()=>$n,nearestColorIndex:()=>$t,nearestColorIndexWithDistance:()=>Bt,prequantize:()=>Tn,quantize:()=>Sn,snapColorsToPalette:()=>In});var vn={signature:"GIF",version:"89a",trailer:59,extensionIntroducer:33,applicationExtensionLabel:255,graphicControlExtensionLabel:249,imageSeparator:44,signatureSize:3,versionSize:3,globalColorTableFlagMask:128,colorResolutionMask:112,sortFlagMask:8,globalColorTableSizeMask:7,applicationIdentifierSize:8,applicationAuthCodeSize:3,disposalMethodMask:28,userInputFlagMask:2,transparentColorFlagMask:1,localColorTableFlagMask:128,interlaceFlagMask:64,idSortFlagMask:32,localColorTableSizeMask:7};function Pt(e=256){let t=0,n=new Uint8Array(e);return{get buffer(){return n.buffer},reset(){t=0},bytesView(){return n.subarray(0,t)},bytes(){return n.slice(0,t)},writeByte(o){r(t+1),n[t]=o,t++},writeBytes(o,i=0,a=o.length){r(t+a);for(let s=0;s<a;s++)n[t++]=o[s+i]},writeBytesView(o,i=0,a=o.byteLength){r(t+a),n.set(o.subarray(i,i+a),t),t+=a}};function r(o){var i=n.length;if(i>=o)return;var a=1024*1024;o=Math.max(o,i*(i<a?2:1.125)>>>0),i!=0&&(o=Math.max(o,256));let s=n;n=new Uint8Array(o),t>0&&n.set(s.subarray(0,t),0)}}var He=12,Mt=5003,xn=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];function wn(e,t,n,r,o=Pt(512),i=new Uint8Array(256),a=new Int32Array(Mt),s=new Int32Array(Mt)){let p=a.length,c=Math.max(2,r);i.fill(0),s.fill(0),a.fill(-1);let u=0,f=0,l=c+1,d=l,_=!1,m=d,y=(1<<m)-1,h=1<<l-1,v=h+1,b=h+2,g=0,w=n[0],E=0;for(let C=p;C<65536;C*=2)++E;E=8-E,o.writeByte(c),B(h);let M=n.length;for(let C=1;C<M;C++)e:{let k=n[C],P=(k<<He)+w,A=k<<E^w;if(a[A]===P){w=s[A];break e}let j=A===0?1:p-A;for(;a[A]>=0;)if(A-=j,A<0&&(A+=p),a[A]===P){w=s[A];break e}B(w),w=k,b<1<<He?(s[A]=b++,a[A]=P):(a.fill(-1),b=h+2,_=!0,B(h))}return B(w),B(v),o.writeByte(0),o.bytesView();function B(C){for(u&=xn[f],f>0?u|=C<<f:u=C,f+=m;f>=8;)i[g++]=u&255,g>=254&&(o.writeByte(g),o.writeBytesView(i,0,g),g=0),u>>=8,f-=8;if((b>y||_)&&(_?(m=d,y=(1<<m)-1,_=!1):(++m,y=m===He?1<<m:(1<<m)-1)),C==v){for(;f>0;)i[g++]=u&255,g>=254&&(o.writeByte(g),o.writeBytesView(i,0,g),g=0),u>>=8,f-=8;g>0&&(o.writeByte(g),o.writeBytesView(i,0,g),g=0)}}}var kn=wn;function At(e,t,n){return e<<8&63488|t<<2&992|n>>3}function Et(e,t,n,r){return e>>4|t&240|(n&240)<<4|(r&240)<<8}function It(e,t,n){return e>>4<<8|t&240|n>>4}function we(e,t,n){return e<t?t:e>n?n:e}function le(e){return e*e}function St(e,t,n){var r=0,o=1e100;let i=e[t],a=i.cnt,s=i.ac,p=i.rc,c=i.gc,u=i.bc;for(var f=i.fw;f!=0;f=e[f].fw){let d=e[f],_=d.cnt,m=a*_/(a+_);if(!(m>=o)){var l=0;n&&(l+=m*le(d.ac-s),l>=o)||(l+=m*le(d.rc-p),!(l>=o)&&(l+=m*le(d.gc-c),!(l>=o)&&(l+=m*le(d.bc-u),!(l>=o)&&(o=l,r=f))))}}i.err=o,i.nn=r}function Ne(){return{ac:0,rc:0,gc:0,bc:0,cnt:0,nn:0,fw:0,bk:0,tm:0,mtm:0,err:0}}function Mn(e,t){let n=t==="rgb444"?4096:65536,r=new Array(n),o=e.length;if(t==="rgba4444")for(let i=0;i<o;++i){let a=e[i],s=a>>24&255,p=a>>16&255,c=a>>8&255,u=a&255,f=Et(u,c,p,s),l=f in r?r[f]:r[f]=Ne();l.rc+=u,l.gc+=c,l.bc+=p,l.ac+=s,l.cnt++}else if(t==="rgb444")for(let i=0;i<o;++i){let a=e[i],s=a>>16&255,p=a>>8&255,c=a&255,u=It(c,p,s),f=u in r?r[u]:r[u]=Ne();f.rc+=c,f.gc+=p,f.bc+=s,f.cnt++}else for(let i=0;i<o;++i){let a=e[i],s=a>>16&255,p=a>>8&255,c=a&255,u=At(c,p,s),f=u in r?r[u]:r[u]=Ne();f.rc+=c,f.gc+=p,f.bc+=s,f.cnt++}return r}function Sn(e,t,n={}){let{format:r="rgb565",clearAlpha:o=!0,clearAlphaColor:i=0,clearAlphaThreshold:a=0,oneBitAlpha:s=!1}=n;if(!e||!e.buffer)throw new Error("quantize() expected RGBA Uint8Array data");if(!(e instanceof Uint8Array)&&!(e instanceof Uint8ClampedArray))throw new Error("quantize() expected RGBA Uint8Array data");let p=new Uint32Array(e.buffer),c=n.useSqrt!==!1,u=r==="rgba4444",f=Mn(p,r),l=f.length,d=l-1,_=new Uint32Array(l+1);for(var m=0,h=0;h<l;++h){let D=f[h];if(D!=null){var y=1/D.cnt;u&&(D.ac*=y),D.rc*=y,D.gc*=y,D.bc*=y,f[m++]=D}}le(t)/m<.022&&(c=!1);for(var h=0;h<m-1;++h)f[h].fw=h+1,f[h+1].bk=h,c&&(f[h].cnt=Math.sqrt(f[h].cnt));c&&(f[h].cnt=Math.sqrt(f[h].cnt));var v,b,g;for(h=0;h<m;++h){St(f,h,!1);var w=f[h].err;for(b=++_[0];b>1&&(g=b>>1,!(f[v=_[g]].err<=w));b=g)_[b]=v;_[b]=h}var E=m-t;for(h=0;h<E;){for(var M;;){var B=_[1];if(M=f[B],M.tm>=M.mtm&&f[M.nn].mtm<=M.tm)break;M.mtm==d?B=_[1]=_[_[0]--]:(St(f,B,!1),M.tm=h);var w=f[B].err;for(b=1;(g=b+b)<=_[0]&&(g<_[0]&&f[_[g]].err>f[_[g+1]].err&&g++,!(w<=f[v=_[g]].err));b=g)_[b]=v;_[b]=B}var C=f[M.nn],k=M.cnt,P=C.cnt,y=1/(k+P);u&&(M.ac=y*(k*M.ac+P*C.ac)),M.rc=y*(k*M.rc+P*C.rc),M.gc=y*(k*M.gc+P*C.gc),M.bc=y*(k*M.bc+P*C.bc),M.cnt+=C.cnt,M.mtm=++h,f[C.bk].fw=C.fw,f[C.fw].bk=C.bk,C.mtm=d}let A=[];var j=0;for(h=0;;++j){let H=we(Math.round(f[h].rc),0,255),D=we(Math.round(f[h].gc),0,255),G=we(Math.round(f[h].bc),0,255),O=255;u&&(O=we(Math.round(f[h].ac),0,255),s&&(O=O<=(typeof s=="number"?s:127)?0:255),o&&O<=a&&(H=D=G=i,O=0));let z=u?[H,D,G,O]:[H,D,G];if(Cn(A,z)||A.push(z),(h=f[h].fw)==0)break}return A}function Cn(e,t){for(let n=0;n<e.length;n++){let r=e[n],o=r[0]===t[0]&&r[1]===t[1]&&r[2]===t[2],i=r.length>=4&&t.length>=4?r[3]===t[3]:!0;if(o&&i)return!0}return!1}function Me(e,t){var n=0,r;for(r=0;r<e.length;r++){let o=e[r]-t[r];n+=o*o}return n}function ke(e,t){return t>1?Math.round(e/t)*t:e}function Tn(e,{roundRGB:t=5,roundAlpha:n=10,oneBitAlpha:r=null}={}){let o=new Uint32Array(e.buffer);for(let i=0;i<o.length;i++){let a=o[i],s=a>>24&255,p=a>>16&255,c=a>>8&255,u=a&255;s=ke(s,n),r&&(s=s<=(typeof r=="number"?r:127)?0:255),u=ke(u,t),c=ke(c,t),p=ke(p,t),o[i]=s<<24|p<<16|c<<8|u<<0}}function Pn(e,t,n="rgb565"){if(!e||!e.buffer)throw new Error("quantize() expected RGBA Uint8Array data");if(!(e instanceof Uint8Array)&&!(e instanceof Uint8ClampedArray))throw new Error("quantize() expected RGBA Uint8Array data");if(t.length>256)throw new Error("applyPalette() only works with 256 colors or less");let r=new Uint32Array(e.buffer),o=r.length,i=n==="rgb444"?4096:65536,a=new Uint8Array(o),s=new Array(i),p=n==="rgba4444";if(n==="rgba4444")for(let c=0;c<o;c++){let u=r[c],f=u>>24&255,l=u>>16&255,d=u>>8&255,_=u&255,m=Et(_,d,l,f),y=m in s?s[m]:s[m]=An(_,d,l,f,t);a[c]=y}else{let c=n==="rgb444"?It:At;for(let u=0;u<o;u++){let f=r[u],l=f>>16&255,d=f>>8&255,_=f&255,m=c(_,d,l),y=m in s?s[m]:s[m]=En(_,d,l,t);a[u]=y}}return a}function An(e,t,n,r,o){let i=0,a=1e100;for(let s=0;s<o.length;s++){let p=o[s],c=p[3],u=Q(c-r);if(u>a)continue;let f=p[0];if(u+=Q(f-e),u>a)continue;let l=p[1];if(u+=Q(l-t),u>a)continue;let d=p[2];u+=Q(d-n),!(u>a)&&(a=u,i=s)}return i}function En(e,t,n,r){let o=0,i=1e100;for(let a=0;a<r.length;a++){let s=r[a],p=s[0],c=Q(p-e);if(c>i)continue;let u=s[1];if(c+=Q(u-t),c>i)continue;let f=s[2];c+=Q(f-n),!(c>i)&&(i=c,o=a)}return o}function In(e,t,n=5){if(!e.length||!t.length)return;let r=e.map(a=>a.slice(0,3)),o=n*n,i=e[0].length;for(let a=0;a<t.length;a++){let s=t[a];s.length<i?s=[s[0],s[1],s[2],255]:s.length>i?s=s.slice(0,3):s=s.slice();let p=Bt(r,s.slice(0,3),Me),c=p[0],u=p[1];u>0&&u<=o&&(e[c]=s)}}function Q(e){return e*e}function $t(e,t,n=Me){let r=1/0,o=-1;for(let i=0;i<e.length;i++){let a=e[i],s=n(t,a);s<r&&(r=s,o=i)}return o}function Bt(e,t,n=Me){let r=1/0,o=-1;for(let i=0;i<e.length;i++){let a=e[i],s=n(t,a);s<r&&(r=s,o=i)}return[o,r]}function $n(e,t,n=Me){return e[$t(e,t,n)]}function Ft(e={}){let{initialCapacity:t=4096,auto:n=!0}=e,r=Pt(t),o=5003,i=new Uint8Array(256),a=new Int32Array(o),s=new Int32Array(o),p=!1;return{reset(){r.reset(),p=!1},finish(){r.writeByte(vn.trailer)},bytes(){return r.bytes()},bytesView(){return r.bytesView()},get buffer(){return r.buffer},get stream(){return r},writeHeader:c,writeFrame(u,f,l,d={}){let{transparent:_=!1,transparentIndex:m=0,delay:y=0,palette:h=null,repeat:v=0,colorDepth:b=8,dispose:g=-1}=d,w=!1;if(n?p||(w=!0,c(),p=!0):w=!!d.first,f=Math.max(0,Math.floor(f)),l=Math.max(0,Math.floor(l)),w){if(!h)throw new Error("First frame must include a { palette } option");Fn(r,f,l,h,b),Ct(r,h),v>=0&&Ln(r,v)}let E=Math.round(y/10);Bn(r,g,E,_,m);let M=!!h&&!w;Un(r,f,l,M?h:null),M&&Ct(r,h),Dn(r,u,f,l,b,i,a,s)}};function c(){Lt(r,"GIF89a")}}function Bn(e,t,n,r,o){e.writeByte(33),e.writeByte(249),e.writeByte(4),o<0&&(o=0,r=!1);var i,a;r?(i=1,a=2):(i=0,a=0),t>=0&&(a=t&7),a<<=2,e.writeByte(0|a|0|i),X(e,n),e.writeByte(o||0),e.writeByte(0)}function Fn(e,t,n,r,o=8){let s=ze(r.length)-1,p=128|o-1<<4|0|s,c=0,u=0;X(e,t),X(e,n),e.writeBytes([p,c,u])}function Ln(e,t){e.writeByte(33),e.writeByte(255),e.writeByte(11),Lt(e,"NETSCAPE2.0"),e.writeByte(3),e.writeByte(1),X(e,t),e.writeByte(0)}function Ct(e,t){let n=1<<ze(t.length);for(let r=0;r<n;r++){let o=[0,0,0];r<t.length&&(o=t[r]),e.writeByte(o[0]),e.writeByte(o[1]),e.writeByte(o[2])}}function Un(e,t,n,r){if(e.writeByte(44),X(e,0),X(e,0),X(e,t),X(e,n),r){let a=ze(r.length)-1;e.writeByte(128|a)}else e.writeByte(0)}function Dn(e,t,n,r,o=8,i,a,s){kn(n,r,t,o,e,i,a,s)}function X(e,t){e.writeByte(t&255),e.writeByte(t>>8&255)}function Lt(e,t){for(var n=0;n<t.length;n++)e.writeByte(t.charCodeAt(n))}function ze(e){return Math.max(Math.ceil(Math.log2(e)),1)}var Rn=Ft});var ye,$,tt,an,J,Ye,nt,rt,Ae,fe,ae,ot,$e,Ee,Ie,sn,de={},he=[],ln=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,ge=Array.isArray;function W(e,t){for(var n in t)e[n]=t[n];return e}function Be(e){e&&e.parentNode&&e.parentNode.removeChild(e)}function cn(e,t,n){var r,o,i,a={};for(i in t)i=="key"?r=t[i]:i=="ref"?o=t[i]:a[i]=t[i];if(arguments.length>2&&(a.children=arguments.length>3?ye.call(arguments,2):n),typeof e=="function"&&e.defaultProps!=null)for(i in e.defaultProps)a[i]===void 0&&(a[i]=e.defaultProps[i]);return pe(e,a,r,o,null)}function pe(e,t,n,r,o){var i={type:e,props:t,key:n,ref:r,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:o??++tt,__i:-1,__u:0};return o==null&&$.vnode!=null&&$.vnode(i),i}function te(e){return e.children}function _e(e,t){this.props=e,this.context=t}function Z(e,t){if(t==null)return e.__?Z(e.__,e.__i+1):null;for(var n;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null)return n.__e;return typeof e.type=="function"?Z(e):null}function un(e){if(e.__P&&e.__d){var t=e.__v,n=t.__e,r=[],o=[],i=W({},t);i.__v=t.__v+1,$.vnode&&$.vnode(i),Fe(e.__P,i,t,e.__n,e.__P.namespaceURI,32&t.__u?[n]:null,r,n??Z(t),!!(32&t.__u),o),i.__v=t.__v,i.__.__k[i.__i]=i,ct(r,i,o),t.__e=t.__=null,i.__e!=n&&it(i)}}function it(e){if((e=e.__)!=null&&e.__c!=null)return e.__e=e.__c.base=null,e.__k.some(function(t){if(t!=null&&t.__e!=null)return e.__e=e.__c.base=t.__e}),it(e)}function Ze(e){(!e.__d&&(e.__d=!0)&&J.push(e)&&!me.__r++||Ye!=$.debounceRendering)&&((Ye=$.debounceRendering)||nt)(me)}function me(){try{for(var e,t=1;J.length;)J.length>t&&J.sort(rt),e=J.shift(),t=J.length,un(e)}finally{J.length=me.__r=0}}function at(e,t,n,r,o,i,a,s,p,c,u){var f,l,d,_,m,y,h=r&&r.__k||he,v=t.length;for(p=fn(n,t,h,p,v),f=0;f<v;f++)(d=n.__k[f])!=null&&(l=d.__i!=-1&&h[d.__i]||de,d.__i=f,y=Fe(e,d,l,o,i,a,s,p,c,u),_=d.__e,d.ref&&l.ref!=d.ref&&(l.ref&&Le(l.ref,null,d),u.push(d.ref,d.__c||_,d)),m==null&&_!=null&&(m=_),4&d.__u?(p=st(d,p,e),l.__e&&(l.__e=null)):typeof d.type=="function"&&y!==void 0?p=y:_&&(p=_.nextSibling),d.__u&=-7);return n.__e=m,p}function fn(e,t,n,r,o){var i,a,s,p,c,u=n.length,f=u,l=0;for(e.__k=new Array(o),i=0;i<o;i++)(a=t[i])!=null&&typeof a!="boolean"&&typeof a!="function"?(typeof a=="string"||typeof a=="number"||typeof a=="bigint"||a.constructor==String?a=e.__k[i]=pe(null,a,null,null,null):ge(a)?a=e.__k[i]=pe(te,{children:a},null,null,null):a.constructor===void 0&&a.__b>0?a=e.__k[i]=pe(a.type,a.props,a.key,a.ref?a.ref:null,a.__v):e.__k[i]=a,p=i+l,a.__=e,a.__b=e.__b+1,s=null,(c=a.__i=pn(a,n,p,f))!=-1&&(f--,(s=n[c])&&(s.__u|=2)),s==null||s.__v==null?(c==-1&&(o>u?l--:o<u&&l++),typeof a.type!="function"&&(a.__u|=4)):c!=p&&(c==p-1?l--:c==p+1?l++:(c>p?l--:l++,a.__u|=4))):e.__k[i]=null;if(f)for(i=0;i<u;i++)(s=n[i])!=null&&(2&s.__u)==0&&(s.__e==r&&(r=Z(s)),ft(s,s));return r}function st(e,t,n){var r,o;if(typeof e.type=="function"){for(r=e.__k,o=0;r&&o<r.length;o++)r[o]&&(r[o].__=e,t=st(r[o],t,n));return t}e.__e!=t&&(t&&e.type&&!t.parentNode&&(t=Z(e)),t=n.insertBefore(e.__e,t||null));do t=t&&t.nextSibling;while(t!=null&&t.nodeType==8);return t}function pn(e,t,n,r){var o,i,a,s=e.key,p=e.type,c=t[n],u=c!=null&&(2&c.__u)==0;if(c===null&&s==null||u&&s==c.key&&p==c.type)return n;if(r>(u?1:0)){for(o=n-1,i=n+1;o>=0||i<t.length;)if((c=t[a=o>=0?o--:i++])!=null&&(2&c.__u)==0&&s==c.key&&p==c.type)return a}return-1}function Qe(e,t,n){t[0]=="-"?e.setProperty(t,n??""):e[t]=n==null?"":typeof n!="number"||ln.test(t)?n:n+"px"}function ue(e,t,n,r,o){var i,a;e:if(t=="style")if(typeof n=="string")e.style.cssText=n;else{if(typeof r=="string"&&(e.style.cssText=r=""),r)for(t in r)n&&t in n||Qe(e.style,t,"");if(n)for(t in n)r&&n[t]==r[t]||Qe(e.style,t,n[t])}else if(t[0]=="o"&&t[1]=="n")i=t!=(t=t.replace(ot,"$1")),a=t.toLowerCase(),t=a in e||t=="onFocusOut"||t=="onFocusIn"?a.slice(2):t.slice(2),e.l||(e.l={}),e.l[t+i]=n,n?r?n[ae]=r[ae]:(n[ae]=$e,e.addEventListener(t,i?Ie:Ee,i)):e.removeEventListener(t,i?Ie:Ee,i);else{if(o=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!="rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{e[t]=n??"";break e}catch{}typeof n=="function"||(n==null||n===!1&&t[4]!="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&n==1?"":n))}}function et(e){return function(t){if(this.l){var n=this.l[t.type+e];if(t[fe]==null)t[fe]=$e++;else if(t[fe]<n[ae])return;return n($.event?$.event(t):t)}}}function Fe(e,t,n,r,o,i,a,s,p,c){var u,f,l,d,_,m,y,h,v,b,g,w,E,M,B,C,k=t.type;if(t.constructor!==void 0)return null;128&n.__u&&(p=!!(32&n.__u),i=[s=t.__e=n.__e]),(u=$.__b)&&u(t);e:if(typeof k=="function"){f=a.length;try{if(v=t.props,b=k.prototype&&k.prototype.render,g=(u=k.contextType)&&r[u.__c],w=u?g?g.props.value:u.__:r,n.__c?h=(l=t.__c=n.__c).__=l.__E:(b?t.__c=l=new k(v,w):(t.__c=l=new _e(v,w),l.constructor=k,l.render=dn),g&&g.sub(l),l.state||(l.state={}),l.__n=r,d=l.__d=!0,l.__h=[],l._sb=[]),b&&l.__s==null&&(l.__s=l.state),b&&k.getDerivedStateFromProps!=null&&(l.__s==l.state&&(l.__s=W({},l.__s)),W(l.__s,k.getDerivedStateFromProps(v,l.__s))),_=l.props,m=l.state,l.__v=t,d)b&&k.getDerivedStateFromProps==null&&l.componentWillMount!=null&&l.componentWillMount(),b&&l.componentDidMount!=null&&l.__h.push(l.componentDidMount);else{if(b&&k.getDerivedStateFromProps==null&&v!==_&&l.componentWillReceiveProps!=null&&l.componentWillReceiveProps(v,w),t.__v==n.__v||!l.__e&&l.shouldComponentUpdate!=null&&l.shouldComponentUpdate(v,l.__s,w)===!1){t.__v!=n.__v&&(l.props=v,l.state=l.__s,l.__d=!1),t.__e=n.__e,t.__k=n.__k,t.__k.some(function(P){P&&(P.__=t)}),he.push.apply(l.__h,l._sb),l._sb=[],l.__h.length&&a.push(l),s=Z(n);break e}l.componentWillUpdate!=null&&l.componentWillUpdate(v,l.__s,w),b&&l.componentDidUpdate!=null&&l.__h.push(function(){l.componentDidUpdate(_,m,y)})}if(l.context=w,l.props=v,l.__P=e,l.__e=!1,E=$.__r,M=0,b)l.state=l.__s,l.__d=!1,E&&E(t),u=l.render(l.props,l.state,l.context),he.push.apply(l.__h,l._sb),l._sb=[];else do l.__d=!1,E&&E(t),u=l.render(l.props,l.state,l.context),l.state=l.__s;while(l.__d&&++M<25);l.state=l.__s,l.getChildContext!=null&&(r=W(W({},r),l.getChildContext())),b&&!d&&l.getSnapshotBeforeUpdate!=null&&(y=l.getSnapshotBeforeUpdate(_,m)),B=u!=null&&u.type===te&&u.key==null?ut(u.props.children):u,s=at(e,ge(B)?B:[B],t,n,r,o,i,a,s,p,c),l.base=t.__e,t.__u&=-161,l.__h.length&&a.push(l),h&&(l.__E=l.__=null)}catch(P){if(a.length=f,t.__v=null,p||i!=null){if(P.then){for(t.__u|=p?160:128;s&&s.nodeType==8&&s.nextSibling;)s=s.nextSibling;i!=null&&(i[i.indexOf(s)]=null),t.__e=s}else if(i!=null)for(C=i.length;C--;)Be(i[C])}else t.__e=n.__e;t.__k==null&&(t.__k=n.__k||[]),P.then||lt(t),$.__e(P,t,n)}}else i==null&&t.__v==n.__v?(t.__k=n.__k,t.__e=n.__e):s=t.__e=_n(n.__e,t,n,r,o,i,a,p,c);return(u=$.diffed)&&u(t),128&t.__u?void 0:s}function lt(e){e&&(e.__c&&(e.__c.__e=!0),e.__k&&e.__k.some(lt))}function ct(e,t,n){for(var r=0;r<n.length;r++)Le(n[r],n[++r],n[++r]);$.__c&&$.__c(t,e),e.some(function(o){try{e=o.__h,o.__h=[],e.some(function(i){i.call(o)})}catch(i){$.__e(i,o.__v)}})}function ut(e){return typeof e!="object"||e==null||e.__b>0?e:ge(e)?e.map(ut):e.constructor!==void 0?null:W({},e)}function _n(e,t,n,r,o,i,a,s,p){var c,u,f,l,d,_,m,y=n.props||de,h=t.props,v=t.type;if(v=="svg"?o="http://www.w3.org/2000/svg":v=="math"?o="http://www.w3.org/1998/Math/MathML":o||(o="http://www.w3.org/1999/xhtml"),i!=null){for(c=0;c<i.length;c++)if((d=i[c])&&"setAttribute"in d==!!v&&(v?d.localName==v:d.nodeType==3)){e=d,i[c]=null;break}}if(e==null){if(v==null)return document.createTextNode(h);e=document.createElementNS(o,v,h.is&&h),s&&($.__m&&$.__m(t,i),s=!1),i=null}if(v==null)y===h||s&&e.data==h||(e.data=h);else{if(i=v=="textarea"&&h.defaultValue!=null?null:i&&ye.call(e.childNodes),!s&&i!=null)for(y={},c=0;c<e.attributes.length;c++)y[(d=e.attributes[c]).name]=d.value;for(c in y)d=y[c],c=="dangerouslySetInnerHTML"?f=d:c=="children"||c in h||c=="value"&&"defaultValue"in h||c=="checked"&&"defaultChecked"in h||ue(e,c,null,d,o);for(c in h)d=h[c],c=="children"?l=d:c=="dangerouslySetInnerHTML"?u=d:c=="value"?_=d:c=="checked"?m=d:s&&typeof d!="function"||y[c]===d||ue(e,c,d,y[c],o);if(u)s||f&&(u.__html==f.__html||u.__html==e.innerHTML)||(e.innerHTML=u.__html),t.__k=[];else if(f&&(e.innerHTML=""),at(t.type=="template"?e.content:e,ge(l)?l:[l],t,n,r,v=="foreignObject"?"http://www.w3.org/1999/xhtml":o,i,a,i?i[0]:n.__k&&Z(n,0),s,p),i!=null)for(c=i.length;c--;)Be(i[c]);s&&v!="textarea"||(c="value",v=="progress"&&_==null?e.removeAttribute("value"):_!=null&&(_!==e[c]||v=="progress"&&!_||v=="option"&&_!=y[c])&&ue(e,c,_,y[c],o),c="checked",m!=null&&m!=e[c]&&ue(e,c,m,y[c],o))}return e}function Le(e,t,n){try{if(typeof e=="function"){var r=typeof e.__u=="function";r&&e.__u(),r&&t==null||(e.__u=e(t))}else e.current=t}catch(o){$.__e(o,n)}}function ft(e,t,n){var r,o;if($.unmount&&$.unmount(e),(r=e.ref)&&(r.current&&r.current!=e.__e||Le(r,null,t)),(r=e.__c)!=null){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(i){$.__e(i,t)}r.base=r.__P=r.__n=null}if(r=e.__k)for(o=0;o<r.length;o++)r[o]&&ft(r[o],t,n||typeof e.type!="function");n||Be(e.__e),e.__c=e.__=e.__e=void 0}function dn(e,t,n){return this.constructor(e,n)}function pt(e,t,n){var r,o,i,a;t==document&&(t=document.documentElement),$.__&&$.__(e,t),o=(r=typeof n=="function")?null:n&&n.__k||t.__k,i=[],a=[],Fe(t,e=(!r&&n||t).__k=cn(te,null,[e]),o||de,de,t.namespaceURI,!r&&n?[n]:o?null:t.firstChild?ye.call(t.childNodes):null,i,!r&&n?n:o?o.__e:t.firstChild,r,a),ct(i,e,a),e.props.children=null}ye=he.slice,$={__e:function(e,t,n,r){for(var o,i,a;t=t.__;)if((o=t.__c)&&!o.__)try{if((i=o.constructor)&&i.getDerivedStateFromError!=null&&(o.setState(i.getDerivedStateFromError(e)),a=o.__d),o.componentDidCatch!=null&&(o.componentDidCatch(e,r||{}),a=o.__d),a)return o.__E=o}catch(s){e=s}throw e}},tt=0,an=function(e){return e!=null&&e.constructor===void 0},_e.prototype.setState=function(e,t){var n;n=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=W({},this.state),typeof e=="function"&&(e=e(W({},n),this.props)),e&&W(n,e),e!=null&&this.__v&&(t&&this._sb.push(t),Ze(this))},_e.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),Ze(this))},_e.prototype.render=te,J=[],nt=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,rt=function(e,t){return e.__v.__b-t.__v.__b},me.__r=0,Ae=Math.random().toString(8),fe="__d"+Ae,ae="__a"+Ae,ot=/(PointerCapture)$|Capture$/i,$e=0,Ee=et(!1),Ie=et(!0),sn=0;var se,F,Ue,_t,ve=0,xt=[],L=$,dt=L.__b,ht=L.__r,mt=L.diffed,yt=L.__c,gt=L.unmount,bt=L.__;function Re(e,t){L.__h&&L.__h(F,e,ve||t),ve=0;var n=F.__H||(F.__H={__:[],__h:[]});return e>=n.__.length&&n.__.push({}),n.__[e]}function ne(e){return ve=1,hn(kt,e)}function hn(e,t,n){var r=Re(se++,2);if(r.t=e,!r.__c&&(r.__=[n?n(t):kt(void 0,t),function(s){var p=r.__N?r.__N[0]:r.__[0],c=r.t(p,s);p!==c&&(r.__N=[c,r.__[1]],r.__c.setState({}))}],r.__c=F,!F.__f)){var o=function(s,p,c){if(!r.__c.__H)return!0;var u=!1,f=r.__c.props!==s;if(r.__c.__H.__.some(function(d){if(d.__N){u=!0;var _=d.__[0];d.__=d.__N,d.__N=void 0,_!==d.__[0]&&(f=!0)}}),i){var l=i.call(this,s,p,c);return u?l||f:l}return!u||f};F.__f=!0;var i=F.shouldComponentUpdate,a=F.componentWillUpdate;F.componentWillUpdate=function(s,p,c){if(this.__e){var u=i;i=void 0,o(s,p,c),i=u}a&&a.call(this,s,p,c)},F.shouldComponentUpdate=o}return r.__N||r.__}function K(e,t){var n=Re(se++,3);!L.__s&&wt(n.__H,t)&&(n.__=e,n.u=t,F.__H.__h.push(n))}function V(e){return ve=5,xe(function(){return{current:e}},[])}function xe(e,t){var n=Re(se++,7);return wt(n.__H,t)&&(n.__=e(),n.__H=t,n.__h=e),n.__}function mn(){for(var e;e=xt.shift();){var t=e.__H;if(e.__P&&t)try{t.__h.some(be),t.__h.some(De),t.__h=[]}catch(n){t.__h=[],L.__e(n,e.__v)}}}L.__b=function(e){F=null,dt&&dt(e)},L.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),bt&&bt(e,t)},L.__r=function(e){ht&&ht(e),se=0;var t=(F=e.__c).__H;t&&(Ue===F?(t.__h=[],F.__h=[],t.__.some(function(n){n.__N&&(n.__=n.__N),n.u=n.__N=void 0})):(t.__h.some(be),t.__h.some(De),t.__h=[],se=0)),Ue=F},L.diffed=function(e){mt&&mt(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(xt.push(t)!==1&&_t===L.requestAnimationFrame||((_t=L.requestAnimationFrame)||yn)(mn)),t.__H.__.some(function(n){n.u&&(n.__H=n.u,n.u=void 0)})),Ue=F=null},L.__c=function(e,t){t.some(function(n){try{n.__h.some(be),n.__h=n.__h.filter(function(r){return!r.__||De(r)})}catch(r){t.some(function(o){o.__h&&(o.__h=[])}),t=[],L.__e(r,n.__v)}}),yt&&yt(e,t)},L.unmount=function(e){gt&&gt(e);var t,n=e.__c;n&&n.__H&&(n.__H.__.some(function(r){try{be(r)}catch(o){t=o}}),n.__H=void 0,t&&L.__e(t,n.__v))};var vt=typeof requestAnimationFrame=="function";function yn(e){var t,n=function(){clearTimeout(r),vt&&cancelAnimationFrame(t),setTimeout(e)},r=setTimeout(n,35);vt&&(t=requestAnimationFrame(n))}function be(e){var t=F,n=e.__c;typeof n=="function"&&(e.__c=void 0,n()),F=t}function De(e){var t=F;e.__c=e.__(),F=t}function wt(e,t){return!e||e.length!==t.length||t.some(function(n,r){return n!==e[r]})}function kt(e,t){return typeof t=="function"?t(e):t}var oe=on(Ut(),1);var U=(e,t,n)=>e+(t-e)*n,Hn=e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2;function Dt(e){let t=/^#([0-9a-f]{6})$/i.exec(e);if(!t)return;let n=parseInt(t[1],16);return[n>>16&255,n>>8&255,n&255]}function ce(e,t,n){if(e===t)return t;let r=Dt(e),o=Dt(t);return!r||!o?n<.5?e:t:`#${r.map((a,s)=>Math.round(U(a,o[s],n))).map(a=>a.toString(16).padStart(2,"0")).join("")}`}function Se(e,t,n){let r=Hn(Math.max(0,Math.min(1,n)));if(r>=1)return t;let o=new Map(e.shapes.map(s=>[s.key,s])),i=[],a=new Set;for(let s of t.shapes){a.add(s.key);let p=o.get(s.key);if(!p||p.type!==s.type){i.push({...s,opacity:s.opacity*r});continue}i.push(Nn(p,s,r))}for(let s of e.shapes)a.has(s.key)||i.push({...s,opacity:s.opacity*(1-r)});return{width:t.width,height:U(e.height,t.height,r),shapes:i}}function Nn(e,t,n){switch(t.type){case"rect":{let r=e;return{...t,x:U(r.x,t.x,n),y:U(r.y,t.y,n),w:U(r.w,t.w,n),h:U(r.h,t.h,n),fill:ce(r.fill,t.fill,n),opacity:U(r.opacity,t.opacity,n)}}case"circle":{let r=e;return{...t,x:U(r.x,t.x,n),y:U(r.y,t.y,n),radius:U(r.radius,t.radius,n),fill:ce(r.fill,t.fill,n),stroke:ce(r.stroke,t.stroke,n),opacity:U(r.opacity,t.opacity,n)}}case"line":{let r=e;return{...t,x1:U(r.x1,t.x1,n),y1:U(r.y1,t.y1,n),x2:U(r.x2,t.x2,n),y2:U(r.y2,t.y2,n),width:U(r.width,t.width,n),color:ce(r.color,t.color,n),opacity:U(r.opacity,t.opacity,n)}}case"text":{let r=e;return{...t,x:U(r.x,t.x,n),y:U(r.y,t.y,n),text:n<.5?r.text:t.text,color:ce(r.color,t.color,n),opacity:U(r.opacity,t.opacity,n)}}}}var je="\'Inter\', system-ui, -apple-system, \'Segoe UI\', sans-serif",zn="\'JetBrains Mono\', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";function Ce(e,t,n,r,o=0,i=0){e.save(),e.setTransform(n,0,0,n,o,i),e.textBaseline="alphabetic",e.fillStyle=r,e.fillRect(0,0,t.width,t.height+2);for(let a of t.shapes)a.type==="line"&&Ge(e,a);for(let a of t.shapes)(a.type==="rect"||a.type==="circle")&&Ge(e,a);for(let a of t.shapes)a.type==="text"&&Ge(e,a);e.restore()}function Ge(e,t){if(!(t.opacity<=.01)){switch(e.globalAlpha=Math.min(1,t.opacity),t.type){case"rect":{qn(e,t.x,t.y,t.w,t.h,Math.min(t.r,t.w/2,t.h/2)),e.fillStyle=t.fill,e.fill(),t.stroke&&(e.lineWidth=1.5,e.strokeStyle=t.stroke,e.stroke());break}case"circle":{e.beginPath(),e.arc(t.x,t.y,Math.max(0,t.radius),0,Math.PI*2),e.fillStyle=t.fill,e.fill(),e.lineWidth=2,e.strokeStyle=t.stroke,e.stroke();break}case"line":{if(e.beginPath(),e.moveTo(t.x1,t.y1),e.lineTo(t.x2,t.y2),e.strokeStyle=t.color,e.lineWidth=t.width,e.lineCap="round",e.stroke(),t.arrow){let n=Math.atan2(t.y2-t.y1,t.x2-t.x1),r=7+t.width;e.beginPath(),e.moveTo(t.x2,t.y2),e.lineTo(t.x2-r*Math.cos(n-.45),t.y2-r*Math.sin(n-.45)),e.lineTo(t.x2-r*Math.cos(n+.45),t.y2-r*Math.sin(n+.45)),e.closePath(),e.fillStyle=t.color,e.fill()}break}case"text":{e.font=`${t.weight} ${t.size}px ${t.mono?zn:je}`,e.textAlign=t.align,e.fillStyle=t.color,e.fillText(t.text,t.x,t.y);break}}e.globalAlpha=1}}function qn(e,t,n,r,o,i){let a=Math.max(0,i);e.beginPath(),e.moveTo(t+a,n),e.lineTo(t+r-a,n),e.quadraticCurveTo(t+r,n,t+r,n+a),e.lineTo(t+r,n+o-a),e.quadraticCurveTo(t+r,n+o,t+r-a,n+o),e.lineTo(t+a,n+o),e.quadraticCurveTo(t,n+o,t,n+o-a),e.lineTo(t,n+a),e.quadraticCurveTo(t,n,t+a,n),e.closePath()}function Gn(e){let t=e>>>0||1;return()=>(t^=t<<13,t^=t>>>17,t^=t<<5,(t>>>0)%1e5/1e5)}function Rt(e){let t=e.nodes.length,n={};if(t===0)return n;if(e.layout==="manual"){let _=e.nodes.map(g=>g.x??0),m=e.nodes.map(g=>g.y??0),[y,h,v,b]=[Math.min(..._),Math.max(..._),Math.min(...m),Math.max(...m)];for(let g of e.nodes)n[g.id]={x:h===y?.5:((g.x??0)-y)/(h-y),y:b===v?.5:((g.y??0)-v)/(b-v)};return n}if(e.layout==="layered"){let _=new Map(e.nodes.map(b=>[b.id,0]));for(let b of e.edges)_.set(b.to,(_.get(b.to)??0)+1);let m=new Map,y=(b,g,w)=>{if(!w.has(b)&&!((m.get(b)??-1)>=g)){m.set(b,g),w.add(b);for(let E of e.edges)E.from===b&&y(E.to,g+1,w);w.delete(b)}};for(let b of e.nodes)_.get(b.id)||y(b.id,0,new Set);for(let b of e.nodes)m.has(b.id)||m.set(b.id,0);let h=Math.max(...m.values()),v=new Map;for(let b of e.nodes){let g=m.get(b.id);v.set(g,[...v.get(g)??[],b.id])}for(let[b,g]of v)g.forEach((w,E)=>{n[w]={x:h===0?.5:b/h,y:(E+1)/(g.length+1)}});return n}if(e.nodes.forEach((_,m)=>{let y=m/t*Math.PI*2-Math.PI/2;n[_.id]={x:.5+.42*Math.cos(y),y:.5+.42*Math.sin(y)}}),e.layout==="circle"||t<3)return n;let r=Gn(t*7919+e.edges.length),o=e.nodes.map(_=>({...n[_.id],x:n[_.id].x+(r()-.5)*.05})),i=new Map(e.nodes.map((_,m)=>[_.id,m])),a=Math.sqrt(1/t),s=.1;for(let _=0;_<300;_++){let m=o.map(()=>({x:0,y:0}));for(let y=0;y<t;y++)for(let h=y+1;h<t;h++){let v=o[y].x-o[h].x,b=o[y].y-o[h].y,g=Math.max(.001,Math.hypot(v,b)),w=a*a/g;m[y].x+=v/g*w,m[y].y+=b/g*w,m[h].x-=v/g*w,m[h].y-=b/g*w}for(let y of e.edges){let h=i.get(y.from),v=i.get(y.to),b=o[h].x-o[v].x,g=o[h].y-o[v].y,w=Math.max(.001,Math.hypot(b,g)),E=w*w/a;m[h].x-=b/w*E,m[h].y-=g/w*E,m[v].x+=b/w*E,m[v].y+=g/w*E}for(let y=0;y<t;y++){let h=Math.max(.001,Math.hypot(m[y].x,m[y].y));o[y].x+=m[y].x/h*Math.min(h,s),o[y].y+=m[y].y/h*Math.min(h,s)}s*=.985}let p=o.map(_=>_.x),c=o.map(_=>_.y),[u,f,l,d]=[Math.min(...p),Math.max(...p),Math.min(...c),Math.max(...c)];return e.nodes.forEach((_,m)=>{n[_.id]={x:f===u?.5:(o[m].x-u)/(f-u),y:d===l?.5:(o[m].y-l)/(d-l)}}),n}function Ht(e){let t={},n=0,r=0,o=(a,s)=>{if(!a)return;let p=e.nodes[a];p&&(o(p.children[0]??null,s+1),t[a]={col:n++,depth:s},r=Math.max(r,s),o(p.children[1]??null,s+1))},i=(a,s)=>{let p=e.nodes[a];r=Math.max(r,s);let c=(p?.children??[]).filter(u=>!!(u&&e.nodes[u]));if(!c.length)t[a]={col:n++,depth:s};else{let u=c.map(f=>i(f,s+1));t[a]={col:(u[0]+u[u.length-1])/2,depth:s}}return t[a].col};return e.root&&(e.binary?o(e.root,0):i(e.root,0)),{positions:t,columns:n,depth:r}}var zt={bg:"#fbfaf7",panel:"#f2f0ea",ink:"#1c1b18",muted:"#6f6b62",faint:"#d9d5cb",base:"#c9c4b8",baseInk:"#1c1b18",wall:"#3b3933",tones:{active:"#2f6fed",compare:"#e8a317",swap:"#e5484d",done:"#2f9e5b",visited:"#8c6be8",frontier:"#14a0c4",path:"#f2711c",found:"#12a87e",muted:"#b9b4a8",error:"#d93636",pivot:"#c2449b"}},qt={bg:"#141412",panel:"#1d1c19",ink:"#f0ede5",muted:"#9b968a",faint:"#34322d",base:"#4a473f",baseInk:"#f0ede5",wall:"#cfcabd",tones:{active:"#5b8cff",compare:"#f5b83d",swap:"#ff6b6f",done:"#4cc27f",visited:"#a68bff",frontier:"#3cc3e6",path:"#ff8a3d",found:"#36d0a3",muted:"#5d5a52",error:"#ff5a5a",pivot:"#e264b9"}},ee=1e3,R=28,jn=26,Nt=22;function Te(e,t,n){let r=[],o=R;for(let i of e.structs){if(i.kind==="vars")continue;r.push(q(`${i.name}:title`,R,o+12,i.name,13,t.muted,"left",600,!0)),o+=jn;let a=On(i,o,t,n,r);o+=a+Nt}return{width:ee,height:Math.max(o+R-Nt,120),shapes:r}}function On(e,t,n,r,o){switch(e.kind){case"array":return e.style==="bars"?Wn(e,t,n,o):Vn(e,t,n,o);case"grid":return Jn(e,t,n,o);case"graph":return Kn(e,t,n,r,o);case"tree":return Xn(e,t,n,o);default:return 0}}function q(e,t,n,r,o,i,a="center",s=400,p=!1){return{type:"text",key:e,x:t,y:n,text:r,size:o,color:i,align:a,weight:s,mono:p,opacity:1}}function re(e){return e===null?"":typeof e=="number"?Number.isInteger(e)?String(e):String(Math.round(e*100)/100):String(e)}function Gt(e,t,n){return t?e.tones[t]:n}function Wn(e,t,n,r){let o=e.items.length,i=ee-R*2,a=o?i/o:i,s=Math.max(2,Math.min(56,a*.78)),p=210,c=e.items.map(y=>typeof y.value=="number"?y.value:0),u=Math.max(1,...c.map(y=>Math.abs(y))),f=c.some(y=>y<0),l=f?t+p/2:t+p,d=(f?p/2-18:p-22)/u,_=a>=18;e.items.forEach((y,h)=>{let v=typeof y.value=="number"?y.value:0,b=R+a*h+(a-s)/2,g=Math.max(2,Math.abs(v)*d),w=e.marks[h];r.push({type:"rect",key:`${y.key}:bar`,x:b,y:v>=0?l-g:l,w:s,h:g,r:Math.min(6,s/4),fill:Gt(n,w,n.base),opacity:1}),_&&r.push(q(`${y.key}:val`,b+s/2,v>=0?l-g-8:l+g+14,re(y.value),Math.min(14,a*.45),w?n.tones[w]:n.ink,"center",600,!0))});let m=t+p+6;return(_||o<=60)&&(e.items.forEach((y,h)=>{o>30&&h%5!==0||r.push(q(`${e.name}:idx${h}`,R+a*h+a/2,m+10,String(h),11,n.muted,"center",400,!0))}),m+=16),m-t+jt(e.name,e.pointers.map(y=>({name:y.name,x:R+a*y.index+a/2})),m,n,r)}function Vn(e,t,n,r){let o=e.items.length,i=ee-R*2,a=Math.max(14,Math.min(64,o?i/o-6:64)),s=o*(a+6)-6,p=R+Math.max(0,(i-s)/2);e.items.forEach((u,f)=>{let l=p+f*(a+6),d=e.marks[f];r.push({type:"rect",key:`${u.key}:cell`,x:l,y:t,w:a,h:a,r:8,fill:Gt(n,d,n.panel),stroke:d?void 0:n.faint,opacity:1}),r.push(q(`${u.key}:val`,l+a/2,t+a/2+5,re(u.value),Math.min(18,a*.38),d?"#ffffff":n.ink,"center",600,!0))});let c=t+a+6;return e.items.forEach((u,f)=>{o>30&&f%5!==0||r.push(q(`${e.name}:idx${f}`,p+f*(a+6)+a/2,c+10,String(f),11,n.muted,"center",400,!0))}),c+=16,c-t+jt(e.name,e.pointers.map(u=>({name:u.name,x:p+u.index*(a+6)+a/2})),c,n,r)}function jt(e,t,n,r,o){if(!t.length)return 0;let i=[],a=0;for(let s of t){let p=0;for(;i[p]?.some(c=>Math.abs(c.x-s.x)<34);)p++;(i[p]??(i[p]=[])).push({x:s.x}),a=Math.max(a,p),o.push(q(`${e}:ptr:${s.name}`,s.x,n+14+p*18,`\\u25B2 ${s.name}`,13,r.tones.active,"center",700,!0))}return 20+a*18}function Jn(e,t,n,r){let o=e.cells.length,i=e.cells[0]?.length??0,a=ee-R*2,s=Math.max(6,Math.min(44,i?a/i:44)),p=R+(a-s*i)/2;for(let c=0;c<o;c++)for(let u=0;u<i;u++){let f=e.cells[c][u],l=e.marks[`${c},${u}`],d=f==="#";r.push({type:"rect",key:`${e.name}:${c},${u}`,x:p+u*s+1,y:t+c*s+1,w:s-2,h:s-2,r:Math.min(6,s/5),fill:l?n.tones[l]:d?n.wall:n.panel,opacity:1}),!d&&f!==null&&f!==""&&s>=20&&r.push(q(`${e.name}:${c},${u}:v`,p+u*s+s/2,t+c*s+s/2+4,re(f),Math.min(14,s*.38),l?"#ffffff":n.ink,"center",600,!0))}for(let c of e.pointers)r.push({type:"circle",key:`${e.name}:ptr:${c.name}`,x:p+c.col*s+s/2,y:t+c.row*s+s/2,radius:Math.max(3,s*.28),fill:n.ink,stroke:n.bg,opacity:1});return o*s}function Kn(e,t,n,r,o){let i=r.get(e.name);i||(i=Rt(e),r.set(e.name,i));let a=360,s=e.nodes.length>24?14:20,p=c=>{let u=i[c]??{x:.5,y:.5};return{x:R+s+u.x*(ee-2*R-2*s),y:t+s+u.y*(a-2*s)}};for(let c of e.edges){let u=p(c.from),f=p(c.to),l=e.edgeMarks[`${c.from}->${c.to}`],d=Math.max(1,Math.hypot(f.x-u.x,f.y-u.y)),_=(f.x-u.x)/d,m=(f.y-u.y)/d;if(o.push({type:"line",key:`${e.name}:e:${c.from}->${c.to}`,x1:u.x+_*s,y1:u.y+m*s,x2:f.x-_*(s+(e.directed?2:0)),y2:f.y-m*(s+(e.directed?2:0)),color:l?n.tones[l]:n.faint,width:l?4:2,arrow:e.directed,opacity:1}),c.weight!==void 0){let y=(u.x+f.x)/2-m*12,h=(u.y+f.y)/2+_*12;o.push(q(`${e.name}:w:${c.from}->${c.to}`,y,h+4,re(c.weight),12,l?n.tones[l]:n.muted,"center",600,!0))}}for(let c of e.nodes){let u=p(c.id),f=e.nodeMarks[c.id];o.push({type:"circle",key:`${e.name}:n:${c.id}`,x:u.x,y:u.y,radius:s,fill:f?n.tones[f]:n.panel,stroke:f?n.tones[f]:n.base,opacity:1}),o.push(q(`${e.name}:l:${c.id}`,u.x,u.y+5,c.label,s>16?14:11,f?"#ffffff":n.ink,"center",700,!0));let l=e.nodeBadges[c.id];l!==void 0&&o.push(q(`${e.name}:b:${c.id}`,u.x+s+4,u.y-s+2,re(l),12,n.tones.active,"left",700,!0))}return a}function Xn(e,t,n,r){let o=Ht(e);if(!e.root)return r.push(q(`${e.name}:empty`,ee/2,t+24,"(empty)",13,n.muted)),40;let i=19,a=72,s=ee-R*2-i*2,p=o.columns>1?Math.min(90,s/(o.columns-1)):0,c=p*(o.columns-1),u=R+i+(s-c)/2,f=l=>{let d=o.positions[l];return{x:u+d.col*p,y:t+i+d.depth*a}};for(let l of Object.values(e.nodes))if(o.positions[l.id])for(let d of l.children){if(!d||!o.positions[d])continue;let _=f(l.id),m=f(d);r.push({type:"line",key:`${e.name}:e:${d}`,x1:_.x,y1:_.y+i,x2:m.x,y2:m.y-i,color:n.faint,width:2,arrow:!1,opacity:1})}for(let l of Object.values(e.nodes)){if(!o.positions[l.id])continue;let d=f(l.id),_=e.marks[l.id];r.push({type:"circle",key:`${e.name}:n:${l.id}`,x:d.x,y:d.y,radius:i,fill:_?n.tones[_]:n.panel,stroke:_?n.tones[_]:n.base,opacity:1}),r.push(q(`${e.name}:v:${l.id}`,d.x,d.y+5,re(l.value),13,_?"#ffffff":n.ink,"center",700,!0))}return i*2+o.depth*a+6}async function Ot(e,t,n={}){let r=n.width??720,o=5,i=n.delay??50,a=n.hold??1500,s=e.frames.slice(0,n.maxSteps??300),p=new Map,c=s.map(k=>Te(k,t,p)),u=Math.max(...c.map(k=>k.height)),f=r/c[0].width,l=44,d=Math.round(u*f)+l,_=document.createElement("canvas");_.width=r,_.height=d;let m=_.getContext("2d",{willReadFrequently:!0}),y=(k,P)=>{let A=c[k],j=c[Math.max(0,k-1)],H=P>=1?A:Se(j,A,P);Ce(m,{...H,height:u+l/f},f,t.bg);let G=s[k].caption||e.meta.title||"";return m.save(),m.fillStyle=t.panel,m.fillRect(0,d-l,r,l),m.fillStyle=t.ink,m.font=`600 ${Math.round(r/46)}px ${je}`,m.textAlign="left",m.textBaseline="middle",m.fillText(Zn(m,G,r-32),16,d-l/2),m.restore(),m.getImageData(0,0,r,d).data},h=[0,.25,.5,.75,1].map(k=>Math.min(c.length-1,Math.round(k*(c.length-1)))),v=new Uint8ClampedArray(r*d*4*h.length);h.forEach((k,P)=>v.set(y(k,1),P*r*d*4));let b=(0,oe.quantize)(v,128),g=(0,oe.GIFEncoder)(),w=c.length,E=n.tweenFrames??(w>200?1:w>100?3:o),M=null,B=()=>{M&&g.writeFrame(M.index,r,d,{palette:b,delay:M.delay}),M=null},C=(k,P)=>{if(M&&Yn(M.index,k)){M.delay+=P;return}B(),M={index:k,delay:P}};for(let k=0;k<c.length;k++){let P=k===0?1:E;for(let A=1;A<=P;A++){let j=(0,oe.applyPalette)(y(k,A/P),b),H=k===c.length-1&&A===P;C(j,H?a:A===P?i*(E>1?4:6):i)}n.onProgress?.(k+1,w),k%5===0&&await new Promise(A=>setTimeout(A,0))}return B(),g.finish(),new Blob([new Uint8Array(g.bytes())],{type:"image/gif"})}function Yn(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}function Zn(e,t,n){if(e.measureText(t).width<=n)return t;let r=t;for(;r.length>1&&e.measureText(`${r}\\u2026`).width>n;)r=r.slice(0,-1);return`${r}\\u2026`}var Qn=`\n.tp{--tp-bg:#fbfaf7;--tp-panel:#f2f0ea;--tp-ink:#1c1b18;--tp-muted:#6f6b62;--tp-rule:#e3dfd5;--tp-accent:#2f6fed;--tp-hl:#fff1c2;\n  font-family:\'Inter\',system-ui,-apple-system,\'Segoe UI\',sans-serif;color:var(--tp-ink);background:var(--tp-bg);border:1px solid var(--tp-rule);\n  border-radius:14px;overflow:hidden;display:flex;flex-direction:column;outline:none;position:relative}\n.tp[data-theme=dark]{--tp-bg:#141412;--tp-panel:#1d1c19;--tp-ink:#f0ede5;--tp-muted:#9b968a;--tp-rule:#2e2c27;--tp-accent:#5b8cff;--tp-hl:#3b3418}\n.tp:focus-visible{box-shadow:0 0 0 3px color-mix(in srgb,var(--tp-accent) 45%,transparent)}\n.tp *{box-sizing:border-box}\n.tp-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:12px 16px 4px}\n.tp-title{font-weight:700;font-size:15px;letter-spacing:-.01em;margin:0}\n.tp-desc{margin:2px 0 0;font-size:13px;color:var(--tp-muted)}\n.tp-count{font:12px \'JetBrains Mono\',ui-monospace,monospace;color:var(--tp-muted);white-space:nowrap}\n.tp-body{display:grid;grid-template-columns:minmax(0,1fr);gap:0}\n.tp-body.has-side{grid-template-columns:minmax(0,1fr) minmax(220px,32%)}\n@media (max-width:760px){.tp-body.has-side{grid-template-columns:minmax(0,1fr)}}\n.tp-stage{position:relative;min-width:0}\n.tp-stage canvas{display:block;width:100%}\n.tp-side{border-left:1px solid var(--tp-rule);background:var(--tp-panel);min-width:0;display:flex;flex-direction:column;max-height:560px}\n@media (max-width:760px){.tp-side{border-left:0;border-top:1px solid var(--tp-rule);max-height:300px}}\n.tp-code{margin:0;padding:10px 0;overflow:auto;font:12.5px/1.6 \'JetBrains Mono\',ui-monospace,monospace;font-variant-ligatures:none;flex:1;min-height:0}\n.tp-code .ln{display:block;white-space:pre;padding:0 12px 0 0}\n.tp-code .ln.on{background:var(--tp-hl)}\n.tp-code .no{display:inline-block;width:2.6em;text-align:right;padding-right:10px;color:var(--tp-muted);user-select:none}\n.tp-vars{border-top:1px solid var(--tp-rule);padding:8px 12px;font:12.5px \'JetBrains Mono\',ui-monospace,monospace;display:grid;gap:3px}\n.tp-vars:first-child{border-top:0}\n.tp-vars b{font:600 11px \'Inter\',system-ui,sans-serif;color:var(--tp-muted);text-transform:uppercase;letter-spacing:.05em}\n.tp-var{display:flex;justify-content:space-between;gap:10px}\n.tp-var span:last-child{font-weight:700;overflow:hidden;text-overflow:ellipsis}\n.tp-var.changed span:last-child{color:var(--tp-accent)}\n.tp-caption{padding:10px 16px;border-top:1px solid var(--tp-rule);min-height:52px}\n.tp-caption p{margin:0;font-size:14.5px;line-height:1.45}\n.tp-caption small{display:block;margin-top:2px;font:12px \'JetBrains Mono\',ui-monospace,monospace;color:var(--tp-muted)}\n.tp-controls{display:flex;align-items:center;gap:8px;padding:8px 12px;border-top:1px solid var(--tp-rule);flex-wrap:wrap}\n.tp-btn{appearance:none;border:1px solid var(--tp-rule);background:var(--tp-bg);color:var(--tp-ink);border-radius:8px;height:32px;min-width:32px;padding:0 9px;\n  font:600 13px \'Inter\',system-ui,sans-serif;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px}\n.tp-btn:hover{background:var(--tp-panel)}\n.tp-btn.primary{background:var(--tp-ink);color:var(--tp-bg);border-color:var(--tp-ink)}\n.tp-btn:disabled{opacity:.5;cursor:default}\n.tp-range{flex:1;min-width:120px;accent-color:var(--tp-accent)}\n.tp-speed{height:32px;border-radius:8px;border:1px solid var(--tp-rule);background:var(--tp-bg);color:var(--tp-ink);font:12.5px \'Inter\',system-ui,sans-serif;padding:0 6px}\n.tp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n.tp-brand{font:11px \'Inter\',system-ui,sans-serif;color:var(--tp-muted);text-decoration:none;margin-left:auto}\n.tp-brand:hover{text-decoration:underline}\n`,Wt=!1;function Vt(e=document){if(Wt||e.getElementById("traceplay-style"))return;let t=e.createElement("style");t.id="traceplay-style",t.textContent=Qn,e.head.appendChild(t),Wt=!0}var er=0;function T(e,t,n,r,o,i){t||(t={});var a,s,p=t;if("ref"in p)for(s in p={},t)s=="ref"?a=t[s]:p[s]=t[s];var c={type:e,props:p,key:n,ref:a,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--er,__i:-1,__u:0,__source:o,__self:i};if(typeof e=="function"&&(a=e.defaultProps))for(s in a)p[s]===void 0&&(p[s]=a[s]);return $.vnode&&$.vnode(c),c}var tr=[.5,1,2,4];function nr(){let e=typeof window<"u"?window.matchMedia?.("(prefers-color-scheme: dark)"):void 0,[t,n]=ne(!!e?.matches);return K(()=>{if(!e)return;let r=o=>n(o.matches);return e.addEventListener("change",r),()=>e.removeEventListener("change",r)},[e]),t}function Jt({trace:e,autoplay:t=!1,loop:n=!1,theme:r="auto",compact:o=!1,exportable:i=!0,branded:a=!1,start:s=0,onStep:p}){Vt();let c=nr(),u=r==="dark"||r==="auto"&&c,f=u?qt:zt,l=e.frames,d=l.length-1,[_,m]=ne(Math.min(Math.max(0,s),d)),[y,h]=ne(t),[v,b]=ne(1),[g,w]=ne(null),E=V(null),M=V(null),B=V(null),C=V(null),k=V(null),P=V(0),A=V(0),j=V(_),H=xe(()=>{let x=new Map,S=new Map;return I=>{let N=S.get(I);return N||(N=Te(l[I],f,x),S.set(I,N)),N}},[l,f]),D=xe(()=>{let x=0,S=Math.max(1,Math.floor(l.length/200));for(let I=0;I<l.length;I+=S)x=Math.max(x,H(I).height);return Math.max(x,H(d).height)},[H,l,d]),G=x=>{let S=E.current;if(!S||!A.current)return;let I=window.devicePixelRatio||1,N=A.current/x.width,ie=Math.round(D*N);(S.width!==Math.round(A.current*I)||S.height!==Math.round(ie*I))&&(S.width=Math.round(A.current*I),S.height=Math.round(ie*I),S.style.height=`${ie}px`);let Ke=S.getContext("2d");Ke&&Ce(Ke,{...x,height:D},N*I,f.bg)},O=x=>{let S=k.current;if(!S)return;let I=Math.min(1,(x-S.start)/S.duration),N=Se(S.from,S.to,I);C.current=N,G(N),I<1?P.current=requestAnimationFrame(O):k.current=null};K(()=>{let x=H(_),S=C.current,I=Math.abs(_-j.current);if(j.current=_,p?.(_),!S||I===0){C.current=x,G(x);return}cancelAnimationFrame(P.current);let N=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;k.current={from:S,to:x,start:performance.now(),duration:N?1:I===1?420/v:160},P.current=requestAnimationFrame(O)},[_,H]),K(()=>{let x=M.current;if(!x)return;let S=new ResizeObserver(()=>{A.current=x.clientWidth,C.current&&G(C.current)});return S.observe(x),A.current=x.clientWidth,C.current&&G(C.current),()=>S.disconnect()},[D,f]),K(()=>{C.current=H(_),G(C.current)},[f]),K(()=>{if(!y)return;let x=setTimeout(()=>{_>=d?n?m(0):h(!1):m(_+1)},_>=d?1600:650/v);return()=>clearTimeout(x)},[y,_,v,d,n]),K(()=>{let x=B.current?.querySelector(".ln.on"),S=B.current;if(x&&S){let I=x.offsetTop-S.clientHeight/2;S.scrollTo({top:Math.max(0,I),behavior:"smooth"})}},[l[_]?.line]),K(()=>()=>cancelAnimationFrame(P.current),[]);let z=x=>{h(!1),m(Math.min(d,Math.max(0,x)))},Oe=x=>{(x.target.tagName==="SELECT"||x.target.tagName==="INPUT")&&x.key!==" "||(x.key===" "||x.key==="k"?(x.preventDefault(),!y&&_>=d&&m(0),h(!y)):x.key==="ArrowRight"||x.key==="l"?(x.preventDefault(),z(_+1)):x.key==="ArrowLeft"||x.key==="j"?(x.preventDefault(),z(_-1)):x.key==="Home"?(x.preventDefault(),z(0)):x.key==="End"&&(x.preventDefault(),z(d)))},We=async()=>{h(!1),w("0%");try{let x=await Ot(e,f,{onProgress:(N,ie)=>w(`${Math.round(N/ie*100)}%`)}),S=URL.createObjectURL(x),I=document.createElement("a");I.href=S,I.download=`${rr(e.meta.title??"trace")}.gif`,I.click(),setTimeout(()=>URL.revokeObjectURL(S),2e3)}finally{w(null)}},Y=l[_],Ve=Y.structs.filter(x=>x.kind==="vars"),Pe=e.meta.code?e.meta.code.replace(/\\s+$/,"").split(`\n`):[],Je=!o&&(Pe.length>0||Ve.length>0);return T("div",{class:"tp","data-theme":u?"dark":"light",tabIndex:0,role:"region","aria-label":`${e.meta.title??"Trace"} animation. Space to play or pause, arrow keys to step.`,onKeyDown:Oe,children:[T("div",{class:"tp-head",children:[T("div",{children:[e.meta.title&&T("h2",{class:"tp-title",children:e.meta.title}),e.meta.description&&!o&&T("p",{class:"tp-desc",children:e.meta.description})]}),T("span",{class:"tp-count","data-testid":"tp-count",children:["step ",_+1," / ",l.length]})]}),T("div",{class:`tp-body${Je?" has-side":""}`,children:[T("div",{class:"tp-stage",ref:M,children:T("canvas",{ref:E,role:"img","aria-label":Y.caption||Y.event||"trace step"})}),Je&&T("div",{class:"tp-side",children:[Pe.length>0&&T("pre",{class:"tp-code",ref:B,"aria-label":"Code",children:Pe.map((x,S)=>T("span",{class:`ln${Y.line===S+1?" on":""}`,children:[T("span",{class:"no",children:S+1}),x||" "]},S))}),Ve.map(x=>T("div",{class:"tp-vars",children:[T("b",{children:x.name}),Object.entries(x.values).map(([S,I])=>T("div",{class:`tp-var${x.changed.includes(S)?" changed":""}`,children:[T("span",{children:S}),T("span",{children:I===null?"null":typeof I=="string"?JSON.stringify(I):String(I)})]},S))]},x.name))]})]}),T("div",{class:"tp-caption","aria-live":"polite",children:[T("p",{"data-testid":"tp-caption",children:Y.caption||" "}),Y.event&&T("small",{children:Y.event})]}),T("div",{class:"tp-controls",children:[T("button",{type:"button",class:"tp-btn",onClick:()=>z(0),"aria-label":"First step",disabled:_===0,children:"\\u23EE"}),T("button",{type:"button",class:"tp-btn",onClick:()=>z(_-1),"aria-label":"Previous step",disabled:_===0,children:"\\u25C0"}),T("button",{type:"button",class:"tp-btn primary","data-testid":"tp-play",onClick:()=>{!y&&_>=d&&m(0),h(!y)},"aria-label":y?"Pause":"Play",children:y?"\\u275A\\u275A Pause":"\\u25B6 Play"}),T("button",{type:"button",class:"tp-btn",onClick:()=>z(_+1),"aria-label":"Next step",disabled:_===d,children:"\\u25B6"}),T("button",{type:"button",class:"tp-btn",onClick:()=>z(d),"aria-label":"Last step",disabled:_===d,children:"\\u23ED"}),T("input",{class:"tp-range",type:"range",min:0,max:d,value:_,"aria-label":"Step",onInput:x=>z(Number(x.currentTarget.value))}),T("select",{class:"tp-speed",value:v,"aria-label":"Speed",onChange:x=>b(Number(x.currentTarget.value)),children:tr.map(x=>T("option",{value:x,children:[x,"\\xD7"]},x))}),i&&T("button",{type:"button",class:"tp-btn",onClick:()=>{We()},disabled:g!==null,children:g?`GIF ${g}`:"GIF"}),a&&T("a",{class:"tp-brand",href:"https://github.com/feresbr1/traceplay",target:"_blank",rel:"noreferrer",children:"made with traceplay"})]})]})}function rr(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"trace"}var Kt=document.getElementById("traceplay-data"),Xt=document.getElementById("app");if(Kt&&Xt){let e=JSON.parse(Kt.textContent??"{}"),t=document.documentElement.dataset.theme||"auto";pt(T(Jt,{trace:e,theme:t,branded:!0,autoplay:!1}),Xt)}})();\n', reference: "# traceplay API reference\n\nA trace file:\n\n```js\nexport const meta = { title: 'Name', description: 'One line', code: `original source` };\nexport default function (t) {\n  /* run the algorithm with tracked structures */\n}\n```\n\nEvery call that changes something or highlights something records one frame (a snapshot of all structures). Highlights from `compare`, `swap`, `focus`, `set` and `add` last one frame; `mark` lasts until `unmark`.\n\n## Narration and code\n\n| Call                  | Effect                                                             |\n| --------------------- | ------------------------------------------------------------------ |\n| `t.say(text)`         | Caption shown from now until the next `say`                        |\n| `t.line(n)`           | Highlight line `n` (1-based) of `meta.code` from the next frame on |\n| `t.step(caption?)`    | Record a frame explicitly                                          |\n| `t.batch(fn, event?)` | Run many changes inside `fn` as a single frame                     |\n\n## Arrays: `t.array(name, values, { style })`\n\n`style` is `'bars'` (default for numbers) or `'cells'` (default for strings).\n\n`a.length`, `a.get(i)`, `a.values()`, `a.set(i, v)`, `a.swap(i, j)`, `a.compare(i, j)`, `a.focus(i, tone?)`, `a.mark(i | [i, \u2026], tone?)`, `a.unmark(i?)`, `a.pointer(name, i | null)`, `a.push(v)`, `a.pop()`, `a.shift()`, `a.unshift(v)`\n\nSwapped items keep their identity, so they slide to their new positions.\n\n## Grids: `t.grid(name, rows)`\n\n`rows` is a 2-D array; the value `'#'` draws a wall.\n\n`g.rows`, `g.cols`, `g.get(r, c)`, `g.set(r, c, v)`, `g.mark(r, c, tone?)`, `g.unmark(r?, c?)`, `g.focus(r, c, tone?)`, `g.pointer(name, r | null, c?)`\n\n## Graphs: `t.graph(name, { nodes, edges, directed?, layout? })`\n\n- `nodes`: `'A'` or `{ id, label?, x?, y? }` (x/y on every node selects the manual layout)\n- `edges`: `['A', 'B']`, `['A', 'B', weight]` or `{ from, to, weight }`\n- `layout`: `'circle'` (default up to 10 nodes), `'force'`, `'layered'` (DAGs, left to right), `'manual'`\n\n`g.neighbors(id)`, `g.weight(a, b)`, `g.mark(id, tone?)`, `g.unmark(id?)`, `g.focus(id, tone?)`, `g.markEdge(a, b, tone?)`, `g.focusEdge(a, b, tone?)`, `g.badge(id, value | null)` (a small label, for example a distance)\n\n## Trees: `t.tree(name, { binary? })`\n\nBinary by default; pass `{ binary: false }` for n-ary trees. Node ids are returned by `setRoot` and `add`.\n\n`tr.setRoot(value)`, `tr.add(parentId, value, 'left' | 'right')` (n-ary: no side), `tr.root`, `tr.value(id)`, `tr.left(id)`, `tr.right(id)`, `tr.children(id)`, `tr.parent(id)`, `tr.setValue(id, v)`, `tr.remove(id)`, `tr.attach(id, parentId | null, side?)`, `tr.detach(parentId, side)`, `tr.mark(id, tone?)`, `tr.unmark(id?)`, `tr.focus(id, tone?)`\n\nRotations: `t.batch(() => { tr.detach(\u2026); tr.attach(\u2026); \u2026 })`.\n\n## Variables: `t.vars(name, initial)`\n\n`v.get(key)`, `v.set(key, value)`, `v.set({ key: value, \u2026 })`. Changed values are highlighted in the side panel.\n\n## Tones\n\n`active` `compare` `swap` `done` `visited` `frontier` `path` `found` `muted` `error` `pivot`\n\n## Limits\n\nAt most 5,000 frames per trace; use `t.batch` for bulk updates. Values are numbers, strings, booleans or null.\n\n## CLI\n\n```sh\nnpx -y github:feresbr1/traceplay check  file.trace.js      # run + summary\nnpx -y github:feresbr1/traceplay render file.trace.js      # \u2192 file.html (self-contained player)\nnpx -y github:feresbr1/traceplay render file.trace.js -o out.html --theme dark --open\nnpx -y github:feresbr1/traceplay render file.trace.js --json # \u2192 trace JSON\nnpx -y github:feresbr1/traceplay init my-algo                # starter trace\nnpx -y github:feresbr1/traceplay docs                        # this reference\n```\n" }).then(
  (code) => {
    process.exitCode = code;
  },
  (error) => {
    process.stderr.write(
      `traceplay: unexpected error: ${error?.stack ?? String(error)}
`
    );
    process.exitCode = 2;
  }
);
