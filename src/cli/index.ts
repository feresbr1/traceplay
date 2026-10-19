import { main } from './main';

declare const __PLAYER_JS__: string;
declare const __REFERENCE__: string;

// Trace files in projects without "type" are valid ES modules; Node's notice about
// re-parsing them is noise for users, so only that warning is silenced.
process.removeAllListeners('warning');
process.on('warning', (warning: Error & { code?: string }) => {
  if (warning.code === 'MODULE_TYPELESS_PACKAGE_JSON') return;
  process.stderr.write(`${warning.name}: ${warning.message}
`);
});

main(process.argv.slice(2), { playerJs: __PLAYER_JS__, reference: __REFERENCE__ }).then(
  (code) => {
    process.exitCode = code;
  },
  (error: unknown) => {
    process.stderr.write(
      `traceplay: unexpected error: ${(error as Error)?.stack ?? String(error)}\n`,
    );
    process.exitCode = 2;
  },
);
