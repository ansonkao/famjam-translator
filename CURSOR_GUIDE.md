# CURSOR INSTRUCTIONS

Instructions for Cursor AI to generate code.

## Goal of Application

Simple UI to convert English text to Chinese speech. The user can turn type into a text box in English, and upon submitting the text, the app will playback the speech equivalent of that text in Chinese.

## Product Requirements

- [ ] Create a new Next.js project with Tailwind CSS and ESLint
- [ ] Create a single page for the application UI
- [ ] The one page should have a text box for typing into English text
- [ ] Upon hitting "enter", the text will be sent to the backend
- [ ] An API endpoint will receive the text, translate it to Chinese, and convert the Chinese text to audio
- [ ] The translation will be done using DeepL API
- [ ] The audio will be generated using OpenAI Text-to-Speech API
- [ ] The audio will be played back to the user in realtime using streaming

## Development Instructions

- All new UI components should be added to the `src/app/_components` directory
- All new pages should be added to the `src/app` directory
- All new API endpoints should be added to the `src/server/api` directory
- All UI components should be styled using Tailwind CSS and look good. Use a dark theme.
- Current file structure:

```
famjam/
├── .next/
├── node_modules/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── _components/
│   │   │   └── post.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   └── trpc/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── server/
│   │   ├── api/
│   │   │   ├── routers/
│   │   │   │   ├── post.ts
│   │   │   │   ├── root.ts
│   │   │   │   └── trpc.ts
│   │   │   └── auth/
│   │   │       ├── config.ts
│   │   │       └── index.ts
│   │   ├── styles/
│   │   └── trpc/
│   │       ├── query-client.ts
│   │       ├── react.tsx
│   │       └── server.ts
├── .env
├── .env.example
├── .eslintrc.js
├── .gitignore
├── CURSOR_GUIDE.md
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── prettier.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```
