# Phase 6: Next.js Migration Strategy

As discussed, we need to begin porting the Vite + React client over to Next.js 14 for improved SSR/SEO and robust App Router routing.

## Step 1: Initialize Next.js
We will create a new directory (e.g. `client-next`) using `create-next-app`, configuring it to use the new App Router, Tailwind CSS (or just importing our existing styles), and TypeScript.

## Step 2: Migrate Components & Context
We will migrate our modularized `src/components/` and `src/store/` files directly into Next.js. The Context Provider will wrap the layout in Next.js, and components that rely on state will be marked with `"use client"`.

## Step 3: Retire Vite
Once verified, the original Vite config and `src/` directory will be deprecated, and the Node Express server will statically proxy Next.js output.
