// /root/app/apps/mariana/page.tsx
import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import ContextMenu from "./components/ContextMenu";
import { ExtendedTreeViewElement } from "./types";

export default function MarianaApp() {
  const [elements, setElements] = useState<ExtendedTreeViewElement[]>([]);
  const [selectedFile, setSelectedFile] =
    useState<ExtendedTreeViewElement | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    element: ExtendedTreeViewElement;
  } | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, element: ExtendedTreeViewElement) => {
      e.preventDefault();
      const newContextMenu = { x: e.clientX, y: e.clientY, element };
      setContextMenu(newContextMenu);
      setDebugInfo(
        `Context menu opened at (${e.clientX}, ${e.clientY}) for ${element.type}, id: ${element.id}`
      );
    },
    []
  );

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
    setDebugInfo("Context menu closed");
  }, []);

  const handleSelectFile = useCallback((file: ExtendedTreeViewElement) => {
    if (file.type === "file") {
      setSelectedFile(file);
      setDebugInfo(`Selected file: ${file.name}`);
    }
  }, []);

  return (
    <AnimatePresence>
      <div className="mariana-app h-full w-full flex flex-col bg-black bg-opacity-50 backdrop-blur-md text-white">
        <div className="flex flex-grow overflow-hidden">
          <Sidebar
            elements={elements}
            onSelectFile={handleSelectFile}
            onContextMenu={handleContextMenu}
          />
          <Editor selectedFile={selectedFile} />
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              element={contextMenu.element}
              onClose={handleCloseContextMenu}
              elements={elements}
              setElements={setElements}
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
