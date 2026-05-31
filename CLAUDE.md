# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sales order management mobile app built with React Native (Expo) + PocketBase backend. All frontend code is in `frontend/`.

## Commands

```bash
# Dev server (tunnel mode for mobile testing)
make start
# or: cd frontend && npx expo start

# Run on specific platforms
cd frontend && npx expo run:ios
cd frontend && npx expo run:android
cd frontend && npx expo start --web

# Tests
cd frontend && npx jest --watchAll
cd frontend && npx jest path/to/test  # single test

# Lint
cd frontend && npx expo lint

# EAS build & deploy
make build-ios
make build-android
make update  # OTA update to preview channel
```

## Architecture

- **Framework**: Expo (React Native) with file-based routing via Expo Router
- **Backend**: PocketBase at `https://tmp-order.work` — collections: users, products, customers, orders
- **State**: Zustand stores in `frontend/services/` (UserService, OrderService, ContainerService, ProductService, CustomerService)
- **Auth**: PocketBase AuthStore + Expo Secure Store for persistence. Auth guard in `app/(app)/_layout.tsx` redirects to `/login`
- **Routing**: `app/(app)/(tabs)/` contains tab screens (home, orders, sales, settings). Sales has nested routes for customer/order flows
- **Styling**: React Native inline styles with color constants in `utils/constants.ts` (PRIMARY_DARK: `#17335c`, PRIMARY_LIGHT: `#114781`)
- **Container system**: Complex container type/size/pricing logic in `types/container.ts` and `ContainerService.ts` with legacy migration support

## Rules

- Do not commit planning or spec documentation (e.g. `docs/superpowers/specs/`).

## Conventions

- TypeScript strict mode
- Prettier: 2-space tabs, trailing commas (es5), single attribute per line in JSX, 80 char width
- Path alias: `@/*` maps to project root
