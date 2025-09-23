import { useEffect } from "react";
import FolderComp from "../components/Folder";

import { ContextMenu } from "ui";

import useCurrentFolderStore from "../stores/currentFolder";
import useActiveNotebookStore from "../stores/activeNotebook";
import useFolderCreationStore from "../stores/folderCreation";
import useFolderTreeStore from "../stores/folderTree";
import type { FolderDisplay } from "../stores/folderTree";

// FOLDER SAKUJO WARN trash

export default function FolderTree({ isRoot, folder, nest = 0 }: {
  isRoot?: boolean;
  folder: FolderDisplay;
  nest?: number;
}) {
  const notebook = useActiveNotebookStore((s) => s.notebook);

  const currentFolderPath = useCurrentFolderStore((s) => s.folderPath);
  const setCurrentFolderPath = useCurrentFolderStore((s) => s.setFolderPath);
  const folderCreationStore = useFolderCreationStore();

  const folderTreeStore = useFolderTreeStore();

  const openChildren = () => {
    notebook?.listFolders(folder.path).then((folders) => {
      const children: FolderDisplay[] = folders.map((f) => ({
        name: f.name,
        path: f.path,
        iconUrl: f.iconUrl,
        isOpen: false,
        childrenExists: f.childrenExists,
        children: null,
      }));

      folderTreeStore.setFolder(folder.path, {
        isOpen: true,
        children,
      });
    });
  };


  const closeChildren = () => {
    folderTreeStore.setFolder(folder.path, {
      isOpen: false,
      children: null,
    });
  };

  useEffect(() => {
    if ((folder.isOpen && folder.children === null && folder.childrenExists) || folderCreationStore.parentPath === folder.path) {
      openChildren();
    }
  }, [folder.path]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {folderCreationStore.editingPath === folder.path ? (
        <FolderComp
          mode="input"
          nest={nest}
          initialValue={folder.name}
          onSubmit={(name) => {
            const newPath = folder.path.split("/").slice(0, -1).concat([name]).join("/");
            
            notebook?.renameFolder(folder.path, newPath).then((newFolder) => {
              folderCreationStore.reset();
              folderTreeStore.setFolder(folder.path, {
                name: newFolder.name,
                path: newFolder.path
              })
              setCurrentFolderPath(newFolder.path);
            });
          }}
          onCancel={() => {
            folderCreationStore.reset();
          }}
        />
      ) : (
        <ContextMenu items={[
          {
            key: "new-folder",
            label: "新しいフォルダ",
            icon: { type: "lucide", name: "Plus" },
            onSelect: () => {
              setTimeout(() => {
                folderCreationStore.setParentPath(folder.path);
              }, 128);
            }
          },
          {
            key: "rename-folder",
            label: "名前を変更",
            disabled: isRoot,
            icon: { type: "lucide", name: "Edit3" },
            onSelect: () => {
              setTimeout(() => {
                folderCreationStore.setEditingPath(folder.path);
              }, 128);
            }
          },
          {
            key: "delete-folder",
            label: "削除",
            disabled: isRoot,
            icon: { type: "lucide", name: "Trash2" },
            onSelect: () => {
              notebook?.deleteFolder(folder.path).then(() => {
                folderTreeStore.removeFolder(folder.path);
              })
            }
          },
        ]}>
          <FolderComp
            mode="display"
            folder={folder}
            nest={nest}
            isOpen={folder.isOpen}
            onToggle={() => (folder.isOpen ? closeChildren() : openChildren())}
            isActive={currentFolderPath === folder.path}
            onSelect={() => setCurrentFolderPath(folder.path)}
            childrenExists={folder.childrenExists}
            isRoot={isRoot}
          />
        </ContextMenu>
      )}
      {folderCreationStore.parentPath === folder.path && (
        <FolderComp
          mode="input"
          nest={nest + 1}
          onSubmit={(name) => {
            notebook?.newFolder(folder.path + "/" + name).then((newFolder) => {
              folderCreationStore.reset();
              folderTreeStore.setFolder(folder.path, {
                isOpen: true,
                children: [
                  ...(folder.children || []),
                  {
                    name: newFolder.name,
                    path: newFolder.path,
                    iconUrl: newFolder.iconUrl,
                    isOpen: false,
                    childrenExists: newFolder.childrenExists,
                    children: null,
                  }
                ]
              })
              setCurrentFolderPath(newFolder.path);
            });
          }}
          onCancel={() => {
            folderCreationStore.reset();
          }}
        />
      )}
      {folder.isOpen &&
        folder.children?.map((child) => (
          <FolderTree
            key={child.path}
            folder={child}
            nest={nest + 1}
          />
        ))}
    </>
  );
}
