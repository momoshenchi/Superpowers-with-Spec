# Installation

## Prerequisites

- **Node.js 20.19.0 or higher** — Check your version: `node --version`

## Package Managers

### npm

```bash
npm install -g superpowers-spec@latest
```

### pnpm

```bash
pnpm add -g superpowers-spec@latest
```

### yarn

```bash
yarn global add superpowers-spec@latest
```

### bun

```bash
bun add -g superpowers-spec@latest
```

## Nix

Run Superpowers directly without installation:

```bash
nix run github:momoshenchi/Superpowers-with-Spec -- init
```

Or install to your profile:

```bash
nix profile install github:momoshenchi/Superpowers-with-Spec
```

Or add to your development environment in `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    superpowers.url = "github:momoshenchi/Superpowers-with-Spec";
  };

  outputs = { nixpkgs, superpowers, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ superpowers.packages.x86_64-linux.default ];
    };
  };
}
```

## Verify Installation

```bash
superpowers --version
```

## Next Steps

After installing, initialize Superpowers in your project:

```bash
cd your-project
superpowers init
```

See [Getting Started](getting-started.md) for a full walkthrough.
