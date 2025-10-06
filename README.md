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

## Information about Hackatime projects
The Summer of Making "Citronote 3" project has several Hackatime projects linked to it, and this is one of them, the app itself that is currently available.

For other Hackatime projects, please see these:

* **`citronote`**
  - This is the originally developed codebase for Citronote 3. Since we were inexperienced with large-scale development, the codebase became chaotic, making further development difficult, so a new codebase was created.
* **`citronote-3`**
  - **This repository**
  - A new codebase created because the `citronote` codebase had become hard to maintain. Some parts of the code are directly reused from `citronote`.
* **`citronote-3-git`**
  - **This repository**
  - After accidentally breaking the `citronote-3` working directory due to incorrect Git operations, this is a git clone in a new folder. Its contents are the same as `citronote-3`.
* **`citronote-3-som-site`**
  - The site for the demo page created initially.
* **`citronote-3-som-demo`**
  - Since we weren’t entirely satisfied with `citronote-3-som-site`, we reused some parts and created a separate codebase.
  - Used as a demo link on Summer of Making.
  - Deployed here: https://som.citronote.korange.work/
* **`cmexpt-4citronote`**
  - An experimental app made when trying to use Codemirror 6 as a Markdown editor.
* **`citron-editor-cm` / `citronote-editor`**
  - A prototype made when attempting to create a custom Markdown editor.
* **`prosemark-ctrn3-tempfork`**
  - An internal fork of [ProseMark](https://github.com/jsimonrichard/ProseMark/), currently used as the Markdown editor.
