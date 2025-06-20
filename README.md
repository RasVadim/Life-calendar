# 🗓️ Life Calendar — Your Life Visualized by Years & Weeks

A minimalist **PWA** app that visualizes a human lifespan as a grid of weeks or years. Each square represents a week or a year of your life — helping you **grasp the passage of time** and **use it more intentionally**.

## 🌐 Deployed
https://calendarlife.vercel.app

## 🧠 Tech Stack

- ⚛️ React + TypeScript
- ⚡ Vite
- 🎨 Stylus
- 🧪 ESLint + Prettier
- 📦 Yarn
- 📱 PWA-ready (offline support, manifest, icons)
- 🚀 Deploy-ready for Vercel / Netlify / Cloudflare Pages

## 📦 Install

```bash
git clone https://github.com/RasVadim/Life-calendar.git
cd Life-calendar
yarn install
```

## ▶️ Run Locally

```bash
yarn dev
```

Open in browser: [http://localhost:5173](http://localhost:5173)

## 📱 Mobile & PWA Support

- Fully responsive layout
- Installable as a PWA
- Offline support via service worker
- Optimized for mobile devices

Make sure your `index.html` includes a mobile-friendly viewport meta tag:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

## 🛠️ ESLint Configuration

Type-aware linting is enabled with the following:

- `@typescript-eslint/eslint-plugin`
- `eslint-plugin-react`
- `eslint-plugin-react/jsx-runtime`
- `eslint-plugin-import`
- `prettier`

To extend or update rules, see `.eslintrc.cjs`.

---

## 🤝 License

MIT — use freely, with gratitude 🙏