import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/assets/index.css";
import NotebookSelector from "./App.tsx";
import { clearLoading } from "@/commonInits.ts";
import { initI18n } from "@/initI18n.ts";

initI18n();

clearLoading();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NotebookSelector />
  </StrictMode>,
);
