import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

function errorsOf(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  return errors;
}

test('landing: hero autoplays a real trace, gallery links to players', async ({ page }) => {
  const errors = errorsOf(page);
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Watch any code');
  const count = page.getByTestId('hero-player').getByTestId('tp-count');
  const first = await count.textContent();
  await expect(count).not.toHaveText(first!, { timeout: 5000 });
  const cards = page.getByTestId('gallery-card');
  expect(await cards.count()).toBeGreaterThanOrEqual(10);
  await cards.filter({ hasText: 'Dijkstra' }).click();
  await expect(page).toHaveURL(/#\/example\/dijkstra$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("Dijkstra's shortest paths");
  expect(errors).toEqual([]);
});

test('example player: keyboard, scrubbing, code highlight', async ({ page }) => {
  await page.goto('./#/example/binary-search');
  const player = page.locator('.tp');
  await player.focus();
  await page.keyboard.press('End');
  await expect(page.getByTestId('tp-count')).toHaveText(/step (\d+) \/ \1/);
  await expect(page.getByTestId('tp-caption')).toContainText('Found it');
  await page.keyboard.press('Home');
  await expect(page.getByTestId('tp-count')).toHaveText(/^step 1 \//);
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('tp-count')).toHaveText(/^step 3 \//);
  await page.getByLabel('Step', { exact: true }).fill('10');
  await expect(page.getByTestId('tp-count')).toHaveText(/^step 11 \//);
  await expect(page.locator('.tp-code .ln.on')).toHaveCount(1);
});

test('GIF export downloads a real GIF', async ({ page }) => {
  await page.goto('./#/example/binary-search');
  const download = page.waitForEvent('download', { timeout: 60_000 });
  await page.getByRole('button', { name: 'GIF' }).click();
  const file = await (await download).path();
  const bytes = readFileSync(file);
  expect(bytes.subarray(0, 6).toString('ascii')).toBe('GIF89a');
  expect(bytes.length).toBeGreaterThan(10_000);
});

test('playground: runs code, reports errors, stops infinite loops, shares links', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  const errors = errorsOf(page);
  await page.goto('./#/play');
  // The starter runs automatically.
  await expect(page.getByTestId('tp-caption')).toBeVisible();
  const editor = page.getByLabel('Trace code');

  await editor.fill(
    `export default function (t) {\n  const a = t.array('a', [3, 1, 2]);\n  a.swap(0, 9);\n}`,
  );
  await page.getByRole('button', { name: '▶ Run' }).click();
  await expect(page.getByTestId('play-error')).toContainText('Index 9 is outside a');

  await editor.fill(
    `export default function (t) {\n  const a = t.array('a', [1]);\n  for (;;) {}\n}`,
  );
  await page.getByRole('button', { name: '▶ Run' }).click();
  await expect(page.getByTestId('play-error')).toContainText('infinite loop', { timeout: 10_000 });

  const code = `export const meta = { title: 'Shared trace' };\nexport default function (t) {\n  const a = t.array('a', [4, 3, 2, 1]);\n  a.swap(0, 3);\n  t.say('shared!');\n}`;
  await editor.fill(code);
  await page.keyboard.press('Control+Enter');
  await expect(page.getByTestId('tp-caption')).toHaveText('shared!');
  await page.getByRole('button', { name: 'Share link' }).click();
  await expect(page).toHaveURL(/#\/play\?code=/);
  const url = page.url();

  const fresh = await context.newPage();
  await fresh.goto(url);
  await expect(fresh.getByLabel('Trace code')).toHaveValue(code);
  await expect(fresh.locator('.tp-title')).toHaveText('Shared trace');
  // Worker errors from the deliberate failures are expected; nothing else should log.
  expect(errors.filter((e) => !/outside a/.test(e))).toEqual([]);
});

test('edit an example in the playground', async ({ page }) => {
  await page.goto('./#/example/bst');
  await page.getByRole('link', { name: 'Edit in playground' }).click();
  await expect(page.getByLabel('Trace code')).toHaveValue(/Binary search tree/);
  await expect(page.locator('.tp-title')).toHaveText('Binary search tree: insert and search');
});
