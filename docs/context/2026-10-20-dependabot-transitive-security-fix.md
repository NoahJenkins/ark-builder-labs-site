# Dependabot transitive security fix

Date: 2026-10-20

The seven open Dependabot alerts on `main` affected transitive packages in
`pnpm-lock.yaml`: `@humanfs/node`, two versions each of `brace-expansion` and
`js-yaml`, `source-map-js`, and `sprintf-js`.

Existing workspace overrides still selected vulnerable versions. The repair
updates vulnerable version ranges to patched releases within the same major:
`@humanfs/node` 0.16.8, `brace-expansion` 1.1.21 and 2.1.7, `js-yaml` 3.15.2 and
4.3.2, and `source-map-js` 1.2.2. The lockfile retains unrelated dependencies.

`sprintf-js` has no patched release. Its only dependency path was
`js-yaml` 3 → `argparse` 1 → `sprintf-js`. A parent-scoped override selects
`argparse` 2.0.1 for `js-yaml` 3 and removes `sprintf-js` from the graph.
`gray-matter` must retain `js-yaml` 3 because it calls `safeLoad` and `safeDump`.

The old `js-yaml` CLI uses argparse 1 APIs. Argparse 2 has compatibility aliases,
but its legacy version constructor option returns an empty version string.
The tracked pnpm patch changes only that CLI to argparse 2 APIs, with an explicit
version action. Keep the patch and scoped override together. Remove them when
upstream provides a compatible release that no longer needs `sprintf-js`.

The new dependency compatibility suite reads real blog content, tests YAML
serialization and empty-merge budget enforcement in both YAML majors, and
executes CLI conversion, flags, errors, help, and version controls. Existing
blog unit tests mock the parser and cannot verify these dependency contracts.

The package audit also reports `GHSA-vfj7-8cjw-p6xm` for `braces` 3.0.3, which
has no patched release. GitHub alert #112 is `auto_dismissed`. This separate
upstream issue remains; no audit exception or manual alert dismissal was added.

PR #166 was an intentional draft for Dell CI routing. Auto-merge correctly
skipped it because it was not a Dependabot PR. Live Dell acceptance was pending.
The maintainer requested closure with the branch retained. The PR was closed;
`ci/optiplex-dell-runner` remains at
`3180f143780acfdfb1424cf77ca1735674f5c895`.

The last routine Dependabot PR (#167) merged on 2026-10-19. Live repository
settings permit auto-merge and Actions approvals. This repair does not change
the merge policy or CI routing.
