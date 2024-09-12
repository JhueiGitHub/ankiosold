// /root/app/apps/obsidian/components/ContextMenu.tsx
import React, { useEffect, useRef, useCallback } from "react";
import { ContextMenuProps, FolderStructure } from "../types";

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  type,
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
      };
      setFolders((prev) => [...prev, newFolder]);
    }
    onClose();
  }, [setFolders, onClose]);

  const createFile = useCallback(() => {
    const newFileName = prompt("Enter file name:");
    if (newFileName) {
      const newFile: FolderStructure = {
        id: `file-${Date.now()}`,
        name: newFileName,
        type: "file",
        content: "",
      };
      setFolders((prev) => [...prev, newFile]);
    }
    onClose();
  }, [setFolders, onClose]);

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
      {type === "folder" && (
        <>
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
        </>
      )}
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
