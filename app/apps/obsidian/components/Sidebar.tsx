// /root/app/apps/obsidian/components/Sidebar.tsx
import React, { useState, useCallback } from "react";
import { FolderStructure, ItemType, SidebarProps } from "../types";
import { FolderIcon, ChevronRight, ChevronDown, FileIcon } from "lucide-react";

const Sidebar: React.FC<SidebarProps> = ({
  folders,
  setFolders,
  onContextMenu,
  onSelectFile,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const toggleFolder = useCallback((id: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleItemClick = useCallback(
    (e: React.MouseEvent, item: FolderStructure) => {
      if (item.type === "folder") {
        toggleFolder(item.id);
      } else {
        onSelectFile(item);
      }
    },
    [onSelectFile, toggleFolder]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, item: FolderStructure | ItemType) => {
      e.preventDefault();
      onContextMenu(e, item as FolderStructure);
    },
    [onContextMenu]
  );

  const renderItem = useCallback(
    (item: FolderStructure, depth: number = 0) => {
      const isExpanded = expandedFolders.has(item.id);

      return (
        <div key={item.id} style={{ marginLeft: `${depth * 16}px` }}>
          <div
            className="flex items-center cursor-pointer hover:bg-white hover:bg-opacity-10 rounded p-1"
            onClick={(e) => handleItemClick(e, item)}
            onContextMenu={(e) => handleContextMenu(e, item)}
          >
            {item.type === "folder" &&
              (isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              ))}
            {item.type === "folder" ? (
              <FolderIcon size={16} className="mr-2" />
            ) : (
              <FileIcon size={16} className="mr-2" />
            )}
            <span>{item.name}</span>
          </div>
          {item.type === "folder" && isExpanded && item.children && (
            <div>
              {item.children.map((child) => renderItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    },
    [expandedFolders, handleContextMenu, handleItemClick]
  );

  return (
    <div
      className="w-64 h-full overflow-y-auto border-r border-white border-opacity-20 p-4"
      onContextMenu={(e) => handleContextMenu(e, "folder")}
    >
      <h2 className="text-xl font-semibold mb-4">Files</h2>
      {folders.map((folder) => renderItem(folder))}
    </div>
  );
};

export default Sidebar;
