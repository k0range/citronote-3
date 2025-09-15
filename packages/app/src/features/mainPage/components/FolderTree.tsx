import React, { useEffect } from "react";
import FolderComp from "../components/Folder";
import type { Folder } from "core/notebooks";

import useCurrentFolderStore from "../stores/currentFolder";
import useActiveNotebookStore from "../stores/activeNotebook";
import useFolderCreationStore from "../stores/folderCreation";
import ContextMenu from "@/components/ContextMenu";

export default function FolderTree({ isRoot, folder, nest = 0 }: {
  isRoot?: boolean;
  folder: Folder;
  nest?: number;
}) {
  const notebook = useActiveNotebookStore((s) => s.notebook);

  const currentPath = useCurrentFolderStore((s) => s.folder?.path);
  const setCurrentFolder = useCurrentFolderStore((s) => s.setFolder);
  const folderCreationStore = useFolderCreationStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [children, setChildren] = React.useState<Folder[] | null>(null);

  const openChildren = () => {
    setIsOpen(true);
    notebook?.listFolders(folder.path).then((folders) => {
      setChildren(folders);
    });
  };

  const closeChildren = () => {
    setIsOpen(false);
    setChildren(null); // free memory
  };

  useEffect(() => {
    if (isRoot || folderCreationStore.parentPath === folder.path) {
      openChildren();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRoot, folderCreationStore.parentPath]);

  return (
    <>
      <ContextMenu items={[
        {
          key: "new-folder",
          label: "新しいフォルダ",
          icon: { type: "lucide", name: "Plus" },
          onSelect: () => {
            setTimeout(() => {
              folderCreationStore.setParentPath(folder.path);
            }, 120);
          }
        },
        {
          key: "rename-folder",
          label: "名前を変更",
          disabled: isRoot,
          icon: { type: "lucide", name: "Edit3" },
        },
        {
          key: "delete-folder",
          label: "削除",
          disabled: isRoot,
          icon: { type: "lucide", name: "Trash2" },
        },
      ]}>
        <FolderComp
          mode="display"
          folder={folder}
          nest={nest}
          isOpen={isOpen}
          onToggle={() => (isOpen ? closeChildren() : openChildren())}
          isActive={currentPath === folder.path}
          onSelect={() => setCurrentFolder(folder)}
          childrenExists={folder.childrenExists}
          isRoot={isRoot}
        />
      </ContextMenu>
      {folderCreationStore.parentPath === folder.path && (
        <FolderComp
          mode="input"
          nest={nest + 1}
          onSubmit={(name) => {
            notebook?.newFolder(folder.path + "/" + name).then((newFolder) => {
              folderCreationStore.reset();
              setChildren([
                ...(children || []),
                newFolder
              ]);
              setCurrentFolder(newFolder);
              setIsOpen(true);
            });
          }}
          onCancel={() => {
            folderCreationStore.reset();
          }}
        />
      )}
      {isOpen &&
        children?.map((child) => (
          <FolderTree
            key={child.path}
            folder={child}
            nest={nest + 1}
          />
        ))}
    </>
  );
}
