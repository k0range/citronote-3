import { initCore } from "core/init";
import type { Notebook } from "core/notebooks";

import useActiveNotebookStore from "./stores/activeNotebook";
import useFolderTreeStore from "./stores/folderTree";

export async function initNotebook({ notebook }: { notebook: Notebook }) {
  const setNotebook = useActiveNotebookStore.getState().setNotebook;
  const refetchFolderTree = useFolderTreeStore.getState().refetchFolder;

  setNotebook(notebook);
  refetchFolderTree(notebook);
  
  await initCore({});

  return;
}
