export const meta = {
  title: 'Binary search tree: insert and search',
  description: 'Each value goes left if smaller, right if larger. Searching follows the same path.',
  code: `function insert(node, value) {
  if (!node) return { value };
  if (value < node.value) node.left = insert(node.left, value);
  else node.right = insert(node.right, value);
  return node;
}
function contains(node, value) {
  while (node) {
    if (value === node.value) return true;
    node = value < node.value ? node.left : node.right;
  }
  return false;
}`,
};

export default function (t) {
  const tree = t.tree('bst');
  const values = [50, 30, 70, 20, 40, 60, 80, 35, 45, 65];
  let root = null;

  for (const value of values) {
    t.say(`Insert ${value}.`);
    t.line(1);
    if (!root) {
      t.line(2);
      root = tree.setRoot(value);
      continue;
    }
    let node = root;
    for (;;) {
      t.line(3);
      tree.focus(node, 'compare');
      const side = value < tree.value(node) ? 'left' : 'right';
      t.line(side === 'left' ? 3 : 4);
      const next = side === 'left' ? tree.left(node) : tree.right(node);
      if (!next) {
        t.line(2);
        tree.add(node, value, side);
        break;
      }
      node = next;
    }
  }

  const target = 65;
  t.say(`Search for ${target}: one comparison per level.`);
  let node = root;
  t.line(8);
  while (node) {
    t.line(9);
    tree.mark(node, 'visited');
    if (tree.value(node) === target) {
      t.say(`Found ${target} after visiting ${countDepth(tree, root, target)} nodes.`);
      tree.mark(node, 'found');
      return;
    }
    t.line(10);
    node = target < tree.value(node) ? tree.left(node) : tree.right(node);
  }
  t.line(12);
  t.step('Not found.');
}

function countDepth(tree, root, target) {
  let n = 0;
  for (
    let node = root;
    node;
    node = target < tree.value(node) ? tree.left(node) : tree.right(node)
  ) {
    n++;
    if (tree.value(node) === target) break;
  }
  return n;
}
