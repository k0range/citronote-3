<div align="center">
<h1>
  <a href="https://som.citronote.korange.work/"><picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/assets/logo_dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./docs/assets/logo_light.svg">
  <img alt="Citronote" src="./docs/assets/logo_dark.svg" height="64">
  </picture></a>
</h1>

**A powerful notes app that can save anything.**

</div>

## 🚧 Beta warning
This app is currently released as a preview for the Summer of Making. Please be aware that there may be some unstable parts.

## ✨️ Features

- **Notetypes:**  
  There are dedicated UIs optimized for each purpose, allowing you to capture information efficiently and effortlessly.
- **Markdown:**  
  Markdown is familiar to developers, right? You can format your notes just by surrounding text with a few simple symbols!  
  Also, Citronote comes with a WYSIWYG editor, so you can work on your notes without any distinction between editing and previewing.
- **Filesystem based:**  
  Citronote treats folders on your computer as "notebooks."  
  The contents of the notes are in .md or .txt formats, so they can be handled naturally with other software and file managers.
- **Scrap:**  
  Citronote has a notetype called Scrap.  
  This allows you to keep your thoughts and records in chronological order, like a chat or message. (Surely I'm not the only person who's used a solo chat room for taking notes!)
- **Extensible design:**  
  The Citronote codebase is designed with a strong focus on extensibility.  
  For example, note types are managed through a core registry that allows them to be injected externally. This makes it easy to add new note types or extend existing functionality in a flexible way, while also paving the way for a future plugin system to be implemented seamlessly.
- **Monorepo:**  
  Citronote is a pnpm-based monorepo with separate packages for the React app, Electron desktop app, core logic, utilities, and UI components.  
  This structure allows flexible code sharing, such as reusing logic for a future mobile app or sharing UI components in a plugin system.
- **Tech Stack:**  
  Citronote leverages a modern tech stack, including React 19, Vite, Zustand, Tailwind CSS, Electron, and TypeScript.  
  Looking ahead, we are also considering migrating from Electron to Tauri in the future.

## 🗃️ Monorepo

This repository uses a monorepo with pnpm workspaces. Below are the packages and their descriptions.

- **packages/core**  
  It contains Citronote's core logic, such as abstract classes and managers.
- **packages/app**  
  This is the front-end used in the browser and desktop versions of Citronote, built with React. It can run as a standalone web app, or as a desktop app wrapped in electron. The conditions are separated by the appEnv variable at build time.
- **packages/ui**  
  Contains React UI components. Separated from packages/app so that it can be exposed as a plugin in the future.
- **packages/desktop**  
  This is the desktop version of Citronote, which wraps packages/apps in Electron and includes an API for ipc and processing for saving to appData in the desktop version.
- **packages/shared**  
  Contains common utilities used by many packages.

## 📜 License

This repository is currently public, but a license has not been decided yet.  
**Until a license is chosen, this repository is considered ARR (All Rights Reserved).**

It will be released under an open source license soon. In the meantime, if you wish to fork or use it in any way, please contact me first.
