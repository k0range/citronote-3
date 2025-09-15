import { PlusIcon } from "lucide-react"

import useActiveNotebookStore from "../../stores/activeNotebook"

import FolderTree from "../../components/FolderTree"
import MenuActionButton from "@/components/MenuActionButton"
import useFolderCreationStore from "../../stores/folderCreation";
import useCurrentFolderStore from "../../stores/currentFolder";

export default function Folders() {
  const notebook = useActiveNotebookStore((state) => state.notebook);
  const currentFolder = useCurrentFolderStore((s) => s.folder);
  const folderCreationStore = useFolderCreationStore();

  if (!notebook) {
    throw new Error("No active notebook found");
  }

  return (
    <>
      <FolderTree
        isRoot={true}
        folder={{
          name: notebook.name,
          path: "/",
          childrenExists: true,
          iconUrl: notebook.iconUrl
        }}
      />
      <MenuActionButton
        icon={PlusIcon}
        label="New Folder"
        className="mt-1.5"
        onClick={() => {
          folderCreationStore.setParentPath(currentFolder?.path || "/");
        }}
      />
    </>
  )
}
