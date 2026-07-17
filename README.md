# express-proxy

A local HTTP proxy built with Express. Forward requests from a phone or other device through your computer to a target API—useful when the device cannot reach a restricted domain directly but your laptop can (for example, over VPN).

## How it works

1. Start the proxy on your computer and set `URL` to the upstream API you want to reach.
2. Point your phone or client at your computer's local IP (the server listens on port `3000` by default).
3. Incoming requests are forwarded to `URL` with method, headers, query string, and body preserved.

`config.ts` logs your machine's IP on startup to make it easier to configure the client. On macOS it reads the `en0` interface.

## Requirements

- [Node.js](https://nodejs.org/) 24 or later (TypeScript runs natively via Node's built-in type stripping)

## Getting started

```bash
npm install
URL=https://my.proxied.url.com npm start
```

`PORT` defaults to `3000`. Override it if needed:

```bash
URL=https://my.proxied.url.com PORT=4000 npm start
```

## Development

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm start`         | Run the server with nodemon          |
| `npm run lint`      | Run ESLint and TypeScript typecheck  |
| `npm run typecheck` | Run `tsc --noEmit`                   |
| `npm run format`    | Format source files with Prettier    |
| `npm run clean`     | Remove `node_modules` and lock files |

Pre-commit hooks run Prettier, ESLint, and `tsc` on staged files via [lint-staged](https://github.com/lint-staged/lint-staged).

## Limitations

- Tested with `application/json` and `multipart/form-data` request bodies.
- TLS certificate verification is disabled (`NODE_TLS_REJECT_UNAUTHORIZED=0`) to support self-signed upstream certificates. Do not expose this server to untrusted networks.
- IP logging in [`config.ts`](./config.ts) only checks the macOS `en0` interface.

## License

MIT — see [LICENSE](./LICENSE).
