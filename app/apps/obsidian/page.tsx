// /root/app/apps/obsidian/page.tsx
import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import ContextMenu from "./components/ContextMenu";
import { FolderStructure, ItemType } from "./types";

export default function ObsidianApp() {
  const [folders, setFolders] = useState<FolderStructure[]>([]);
  const [selectedFile, setSelectedFile] = useState<FolderStructure | null>(
    null
  );
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: ItemType;
    parentId: string | null;
  } | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, type: ItemType, parentId: string | null) => {
      e.preventDefault();
      const newContextMenu = { x: e.clientX, y: e.clientY, type, parentId };
      setContextMenu(newContextMenu);
      setDebugInfo(
        `Context menu opened at (${e.clientX}, ${e.clientY}) for ${type}, parent: ${parentId || "root"}`
      );
    },
    []
  );

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
    setDebugInfo("Context menu closed");
  }, []);

  const handleSelectFile = useCallback((file: FolderStructure) => {
    if (file.type === "file") {
      setSelectedFile(file);
      setDebugInfo(`Selected file: ${file.name}`);
    }
  }, []);

  return (
    <AnimatePresence>
      <div className="obsidian-app h-full w-full flex flex-col bg-black bg-opacity-50 backdrop-blur-md text-white">
        <div className="flex flex-grow overflow-hidden">
          <Sidebar
            folders={folders}
            setFolders={setFolders}
            onContextMenu={handleContextMenu}
            onSelectFile={handleSelectFile}
          />
          <Editor selectedFile={selectedFile} />
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              type={contextMenu.type}
              parentId={contextMenu.parentId}
              onClose={handleCloseContextMenu}
              folders={folders}
              setFolders={setFolders}
            />
          )}
        </div>
        <div className="debug-panel bg-black bg-opacity-70 backdrop-blur-md p-2 text-xs text-white border-t border-white border-opacity-20">
          Debug Info: {debugInfo}
        </div>
      </div>
    </AnimatePresence>
  );
}
