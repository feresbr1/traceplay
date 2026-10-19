export const meta = {
  title: 'Token bucket rate limiter',
  description:
    'Each request spends a token; tokens refill at a steady rate. Bursts drain the bucket and get rejected.',
  code: `class TokenBucket {
  constructor(capacity, refillPerSecond) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.rate = refillPerSecond;
    this.last = 0;
  }
  take(now) {
    const elapsed = now - this.last;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.rate);
    this.last = now;
    if (this.tokens < 1) return false;
    this.tokens -= 1;
    return true;
  }
}`,
};

export default function (t) {
  const capacity = 4;
  const rate = 1.5; // tokens per second
  // Request arrival times in seconds: a burst, a pause, another burst.
  const arrivals = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 2.0, 2.1, 2.2, 2.3, 2.4, 4.5];

  const bucket = t.array('tokens', Array(capacity).fill('●'), { style: 'cells' });
  const log = t.array(
    'requests',
    arrivals.map((s) => `${s.toFixed(1)}s`),
    { style: 'cells' },
  );
  const v = t.vars('limiter', { now: 0, tokens: capacity, accepted: 0, rejected: 0 });

  let tokens = capacity;
  let last = 0;
  let accepted = 0;
  let rejected = 0;
  const show = () =>
    t.batch(
      () => {
        for (let i = 0; i < capacity; i++) {
          bucket.set(i, i < Math.floor(tokens) ? '●' : '');
        }
        bucket.unmark();
        for (let i = 0; i < Math.floor(tokens); i++) bucket.mark(i, 'found');
      },
      `${tokens.toFixed(2)} tokens`,
    );

  t.say(`Capacity ${capacity} tokens, refilling ${rate} per second.`);
  show();
  arrivals.forEach((now, i) => {
    log.pointer('now', i);
    t.line(9);
    const elapsed = now - last;
    t.line(10);
    const before = tokens;
    tokens = Math.min(capacity, tokens + elapsed * rate);
    last = now;
    v.set({ now, tokens: Math.round(tokens * 100) / 100 });
    if (tokens > before + 0.01) {
      t.say(
        `${elapsed.toFixed(1)}s since the last request: refill to ${tokens.toFixed(2)} tokens.`,
      );
      show();
    }
    t.line(12);
    if (tokens < 1) {
      rejected++;
      t.say(
        `Request at ${now.toFixed(1)}s: fewer than 1 token left (${tokens.toFixed(2)}). Rejected.`,
      );
      log.mark(i, 'error');
      v.set({ rejected });
      return;
    }
    t.line(13);
    tokens -= 1;
    accepted++;
    t.say(`Request at ${now.toFixed(1)}s: spend a token. Accepted.`);
    log.mark(i, 'done');
    v.set({ tokens: Math.round(tokens * 100) / 100, accepted });
    show();
  });
  log.pointer('now', null);
  t.say(
    `${accepted} accepted, ${rejected} rejected. Bursts beyond ${capacity} requests wait for refills.`,
  );
  t.step();
}
