import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./assets/index.css";
import App from "./App.tsx";
import { cacheTheme, clearLoading } from "./commonInits.ts";
import { initI18n } from "./initI18n.ts";
import { initCore } from "core/init";

initI18n();

cacheTheme()
clearLoading();

await initCore({});

setTimeout(() => {
  clearLoading();
}, 1);

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <App />
  </HashRouter>
);
