# Open Acadora

The complete source project is in this folder. Dependencies and a verified production build are already present in this workspace.

From a terminal in this folder:

```sh
pnpm dev
```

Then open the local URL printed by Vite. If pnpm is not installed, use `npm install` followed by `npm run dev` with Node.js 22.12+ installed.

To test offline behavior, run `pnpm build` then `pnpm preview`, open the printed URL online, and wait for the “ready to use offline” message before disconnecting.

For the complete installation, privacy explanation, limitations, and exact GitHub publication commands, read README.md. For checks actually executed, read VALIDATION.md. The source ZIP excludes generated dependencies and build output; install dependencies after extracting it.
