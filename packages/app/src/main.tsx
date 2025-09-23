import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./assets/index.css";
import App from "./App.tsx";
import { cacheTheme, clearLoading } from "./commonInits.ts";
import { initI18n } from "./initI18n.ts";

initI18n();

cacheTheme()
clearLoading();

setTimeout(() => {
  clearLoading();
}, 1);

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <App />
  </HashRouter>
);
