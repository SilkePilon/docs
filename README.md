# docs

Source of [docs.silkepilon.dev](https://docs.silkepilon.dev): documentation for
my projects, built with [Fumadocs](https://fumadocs.dev).

## Write

Pages are `.mdx` files in [`content/docs`](content/docs), one folder per
project. Each folder's `meta.json` sets the sidebar order.

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Deploy

Push to `main`. GitHub Actions builds `ghcr.io/silkepilon/docs:latest` (a
static export served by nginx), and the homelab rolls it out within a few
minutes. The deployment lives in
[SilkePilon/homelab: apps/sites/docs](https://github.com/SilkePilon/homelab/tree/main/apps/sites/docs).
