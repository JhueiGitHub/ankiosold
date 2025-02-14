// /root/app/apps/obsidian/components/ContextMenu.tsx
import React, { useEffect, useRef, useCallback } from "react";
import { ContextMenuProps, FolderStructure } from "../types";

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  type,
  parentId,
  onClose,
  folders,
  setFolders,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const createFolder = useCallback(() => {
    const newFolderName = prompt("Enter folder name:");
    if (newFolderName) {
      const newFolder: FolderStructure = {
        id: `folder-${Date.now()}`,
        name: newFolderName,
        type: "folder",
        children: [],
        parentId: parentId,
      };
      setFolders((prev) => {
        const updatedFolders = [...prev];
        if (parentId) {
          addItemToFolder(updatedFolders, parentId, newFolder);
        } else {
          updatedFolders.push(newFolder);
        }
        return updatedFolders;
      });
    }
    onClose();
  }, [setFolders, onClose, parentId]);

  const createFile = useCallback(() => {
    const newFileName = prompt("Enter file name:");
    if (newFileName) {
      const newFile: FolderStructure = {
        id: `file-${Date.now()}`,
        name: newFileName,
        type: "file",
        content: "",
        parentId: parentId,
      };
      setFolders((prev) => {
        const updatedFolders = [...prev];
        if (parentId) {
          addItemToFolder(updatedFolders, parentId, newFile);
        } else {
          updatedFolders.push(newFile);
        }
        return updatedFolders;
      });
    }
    onClose();
  }, [setFolders, onClose, parentId]);

  const addItemToFolder = (
    items: FolderStructure[],
    folderId: string,
    newItem: FolderStructure
  ) => {
    for (const item of items) {
      if (item.id === folderId && item.type === "folder") {
        item.children = item.children || [];
        item.children.push(newItem);
        return true;
      }
      if (item.type === "folder" && item.children) {
        if (addItemToFolder(item.children, folderId, newItem)) return true;
      }
    }
    return false;
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-black bg-opacity-80 backdrop-blur-md border border-white border-opacity-20 rounded-md shadow-lg py-2 z-50"
      style={{
        top: `${y}px`,
        left: `${x}px`,
        minWidth: "150px",
      }}
    >
      <button
        className="block w-full text-left px-4 py-2 hover:bg-white hover:bg-opacity-10 text-white"
        onClick={createFolder}
      >
        New Folder
      </button>
      <button
        className="block w-full text-left px-4 py-2 hover:bg-white hover:bg-opacity-10 text-white"
        onClick={createFile}
      >
        New File
      </button>
      {type === "file" && (
        <button
          className="block w-full text-left px-4 py-2 hover:bg-white hover:bg-opacity-10 text-white"
          onClick={onClose}
        >
          Delete File
        </button>
      )}
    </div>
  );
};

export default ContextMenu;
