import { PlusIcon } from "lucide-react"

import useActiveNotebookStore from "../../stores/activeNotebook"

import FolderTree from "../../components/FolderTree"
import { MenuActionButton } from "ui"
import useFolderCreationStore from "../../stores/folderCreation";
import useCurrentFolderStore from "../../stores/currentFolder";
import useFolderTreeStore from "../../stores/folderTree";

export default function Folders() {
  console.log("Render Folders");

  const notebook = useActiveNotebookStore((state) => state.notebook);
  const currentFolderPath = useCurrentFolderStore((s) => s.folderPath);
  const setCurrentFolderPath = useCurrentFolderStore((s) => s.setFolderPath);
  const setCreationPath = useFolderCreationStore((s) => s.setParentPath);
  const folderRoot = useFolderTreeStore((s) => s.root);

  if (!notebook) {
    throw new Error("No active notebook found");
  }
  if (!folderRoot) {
    useFolderTreeStore.getState().setRoot({
      name: notebook.name,
      path: "/",
      iconUrl: notebook.iconUrl,
      isOpen: true,
      childrenExists: true,
      children: null
    });
    setCurrentFolderPath("/");
    return <div>Loading...</div>
  }

  return (
    <>
      <FolderTree
        isRoot={true}
        folder={folderRoot}
      />
      <MenuActionButton
        icon={PlusIcon}
        label="New Folder"
        className="mt-1.5"
        onClick={() => {
          setCreationPath(currentFolderPath || "/");
        }}
      />
    </>
  )
}
