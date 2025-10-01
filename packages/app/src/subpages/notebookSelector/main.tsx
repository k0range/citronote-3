import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/assets/index.css";
import NotebookSelector from "./App.tsx";
import { clearLoading } from "@/commonInits.ts";
import { initI18n } from "@/initI18n.ts";
import { appEnv } from "@/env.ts";
import { AptabaseProvider } from "@aptabase/react";

initI18n();

clearLoading();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AptabaseProvider appKey="A-US-3552054408" options={{
      appVersion: "som-" + appEnv.platform
    }} >
      <NotebookSelector />
    </AptabaseProvider>
  </StrictMode>,
);
