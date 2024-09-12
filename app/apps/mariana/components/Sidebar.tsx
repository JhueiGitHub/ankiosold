// /root/app/apps/mariana/components/Sidebar.tsx
import React from "react";
import { Tree, Folder, File } from "@/components/magicui/file-tree";
import { SidebarProps, ExtendedTreeViewElement } from "../types";

const renderTreeItems = (
  elements: ExtendedTreeViewElement[],
  onSelectFile: (file: ExtendedTreeViewElement) => void,
  onContextMenu: (e: React.MouseEvent, element: ExtendedTreeViewElement) => void
) => {
  return elements.map((element) => {
    if (element.type === "folder") {
      return (
        <Folder
          key={element.id}
          element={element.name}
          value={element.id}
          onContextMenu={(e) => {
            e.preventDefault();
            onContextMenu(e, element);
          }}
        >
          {element.children &&
            renderTreeItems(element.children, onSelectFile, onContextMenu)}
        </Folder>
      );
    } else {
      return (
        <File
          key={element.id}
          value={element.id}
          onContextMenu={(e) => {
            e.preventDefault();
            onContextMenu(e, element);
          }}
          handleSelect={() => onSelectFile(element)}
        >
          {element.name}
        </File>
      );
    }
  });
};

const Sidebar: React.FC<SidebarProps> = ({
  elements,
  onSelectFile,
  onContextMenu,
}) => {
  return (
    <Tree
      className="w-64 h-full border-r border-white border-opacity-20"
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e, { id: "root", name: "Root", type: "folder" });
      }}
    >
      {renderTreeItems(elements, onSelectFile, onContextMenu)}
    </Tree>
  );
};

export default Sidebar;
