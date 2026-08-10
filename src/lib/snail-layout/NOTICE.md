# Vendored: swift-snail-layout

Declarative, SwiftUI-inspired layout engine (frames-as-data + interpolation).

- Source: https://github.com/maximeal10/swift-snail-layout
- Commit: `c60e5475742dac64a744950c1a1fd1efa9366967`
- License: MIT (per upstream README)

## Rules for this folder

- **Do not edit the core** — keep it in sync with upstream. Our adaptations
  (Life Calendar scenes, frame interpolation, Pixi bridge) live outside this folder.
- Internal imports were rewritten from the upstream alias `@/` to `@snail/`
  (aliased to `src/lib/snail-layout` in `vite.config.ts` and `tsconfig.json`).
- To re-sync: re-clone upstream, rewrite imports (both quote styles):
  `sed -E "s#from ('\|\")@/#from \1@snail/#g"`, copy `src/*` here, bump the SHA above,
  and re-apply the local patches below.
- Upstream fixes should be contributed back via PR, not forked here.

## Local patches (re-apply after re-sync)

Minimal edits so the alpha source passes the project's strict `tsc`
(`noUnusedLocals`/`noUnusedParameters`) — behavior unchanged:

- `geometry/rect/types.ts` — double-quoted import missed by the sed rewrite.
- `layout/components/view/ViewBuilder.ts` — drop unused `RectsDataBuffer` import.
- `layout/components/view/ViewNode.ts` — unused `frame` param → `_frame`.
- `layout/LayoutNode.ts` — unused `context` param → `_context`.
