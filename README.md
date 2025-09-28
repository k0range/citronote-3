<div align="center">
<h1>
  <a href="https://citronote.korange.work/"><picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/assets/logo_dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./docs/assets/logo_light.svg">
  <img alt="Citronote" src="./docs/assets/logo_dark.svg" height="64">
  </picture></a>
</h1>

**Citronote 3 Beta**

[👉️ Watch the Site!]()

</div>

## 🚧 Beta warning
このアプリは現在Beta版です。
現在の安定版「Citronote v2」を使用下さい。

## ✨️ Features

- **Notetypes:** 

## 🗃️ Monorepo

This repository uses a monorepo with pnpm workspaces. Below are the packages and their descriptions.

- **packages/core**  
  抽象化されたクラスやManager、Zustandの状態管理などCitronoteのコアロジックが入っています。これは、 packages/app と packages/mobile でのロジックを共通化するためのものです。
- **packages/app**
  Reactで構築された、Citronoteのブラウザ・デスクトップ版で使われているフロントエンドです。これは単体でウェブアプリとしても動作するし、electronで包んでデスクトップ版としても動作します。ビルド時のappEnv変数で条件を分けています
- **packages/desktop**
  packages/app を Electron で包み、ipcでのAPIや、デスクトップ版でのappDataに保存する処理などが入っている Citronote のデスクトップ版です。
- **packages/shared**
  多くのパッケージで使われる、共通の型などが入っています。また、翻訳データもこのパッケージに入れて共通化しています（プラットフォームごとで同じメッセージが多いため）

## 📜 License

This repository is currently public, but a license has not been decided yet.  
**Until a license is chosen, this repository is considered ARR (All Rights Reserved).**

It will be released under an open source license soon. In the meantime, if you wish to fork or use it in any way, please contact me first.
