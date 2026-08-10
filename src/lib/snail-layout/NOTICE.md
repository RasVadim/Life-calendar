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
- To re-sync: re-clone upstream, `sed "s#from '@/#from '@snail/#g"`, copy `src/*` here,
  and bump the commit SHA above.
- Upstream fixes should be contributed back via PR, not forked here.
