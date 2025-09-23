import Store from "electron-store";
import type { NotebookMetadata } from "core/notebooks";

interface AppStateSchema {
  lastVersion: string;
  notebooks: NotebookMetadata[];
  activeNotebooks: string[];
}

export function createAppStateStore({
  userdata,
  version,
}: {
  userdata: string;
  version: string;
}) {
  return new Store<AppStateSchema>({
    name: "app-state",
    cwd: userdata,
    schema: {
      lastVersion: {
        type: "string",
        default: version,
      },
      notebooks: {
        type: "array",
        items: {
          type: "object",
        },
        default: [],
      },
      activeNotebooks: {
        type: "array",
        items: {
          type: "string",
        },
        default: [],
      },
    },
  });
}

export type AppStateStore = Store<AppStateSchema>;
