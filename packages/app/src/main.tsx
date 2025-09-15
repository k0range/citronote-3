import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./assets/index.css";
import App from "./App.tsx";
import { cacheTheme, clearLoading } from "./commonInits.ts";
import { initCore } from "core/buildin";

await initCore({});
cacheTheme()
clearLoading();

setTimeout(() => {
  clearLoading();
}, 1);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
