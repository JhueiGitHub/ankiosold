// /root/app/apps/mariana/components/ContextMenu.tsx
import React, { useEffect, useRef, useCallback } from "react";
import { ContextMenuProps, ExtendedTreeViewElement } from "../types";

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  element,
  onClose,
  elements,
  setElements,
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
      const newFolder: ExtendedTreeViewElement = {
        id: `folder-${Date.now()}`,
        name: newFolderName,
        type: "folder",
        children: [],
      };
      setElements((prev) => {
        const updatedElements = [...prev];
        if (element.type === "folder") {
          const parentFolder = findElementById(updatedElements, element.id);
          if (parentFolder && parentFolder.children) {
            parentFolder.children.push(newFolder);
          } else if (parentFolder) {
            parentFolder.children = [newFolder];
          }
        } else {
          updatedElements.push(newFolder);
        }
        return updatedElements;
      });
    }
    onClose();
  }, [element, setElements, onClose]);

  const createFile = useCallback(() => {
    const newFileName = prompt("Enter file name:");
    if (newFileName) {
      const newFile: ExtendedTreeViewElement = {
        id: `file-${Date.now()}`,
        name: newFileName,
        type: "file",
        content: "",
      };
      setElements((prev) => {
        const updatedElements = [...prev];
        if (element.type === "folder") {
          const parentFolder = findElementById(updatedElements, element.id);
          if (parentFolder && parentFolder.children) {
            parentFolder.children.push(newFile);
          } else if (parentFolder) {
            parentFolder.children = [newFile];
          }
        } else {
          updatedElements.push(newFile);
        }
        return updatedElements;
      });
    }
    onClose();
  }, [element, setElements, onClose]);

  const findElementById = (
    elements: ExtendedTreeViewElement[],
    id: string
  ): ExtendedTreeViewElement | undefined => {
    for (const el of elements) {
      if (el.id === id) return el;
      if (el.children) {
        const found = findElementById(el.children, id);
        if (found) return found;
      }
    }
    return undefined;
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
      {element.type === "file" && (
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
