// /root/app/apps/obsidian/components/Sidebar.tsx
import React, { useState, useCallback, useRef } from "react";
import { FolderStructure, ItemType, SidebarProps, DragInfo } from "../types";
import { FolderIcon, ChevronRight, ChevronDown, FileIcon } from "lucide-react";
import { motion, PanInfo, useAnimation } from "framer-motion";

const SidebarItem: React.FC<{
  item: FolderStructure;
  depth: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onItemClick: (e: React.MouseEvent, item: FolderStructure) => void;
  onContextMenu: (e: React.MouseEvent, item: FolderStructure) => void;
  onDragStart: (item: FolderStructure, depth: number) => void;
  onDragEnd: (e: MouseEvent, info: PanInfo) => void;
}> = ({
  item,
  depth,
  isExpanded,
  onToggle,
  onItemClick,
  onContextMenu,
  onDragStart,
  onDragEnd,
}) => {
  const controls = useAnimation();

  return (
    <motion.div
      style={{ marginLeft: `${depth * 16}px` }}
      animate={controls}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragStart={() => onDragStart(item, depth)}
      onDragEnd={onDragEnd}
      data-folder-id={item.id}
    >
      <div
        className="flex items-center cursor-pointer hover:bg-white hover:bg-opacity-10 rounded p-1"
        onClick={(e) => onItemClick(e, item)}
        onContextMenu={(e) => onContextMenu(e, item)}
      >
        {item.type === "folder" && (
          <span onClick={() => onToggle(item.id)}>
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </span>
        )}
        {item.type === "folder" ? (
          <FolderIcon size={16} className="mr-2" />
        ) : (
          <FileIcon size={16} className="mr-2" />
        )}
        <span>{item.name}</span>
      </div>
      {item.type === "folder" && isExpanded && item.children && (
        <div>
          {item.children.map((child) => (
            <SidebarItem
              key={child.id}
              item={child}
              depth={depth + 1}
              isExpanded={isExpanded}
              onToggle={onToggle}
              onItemClick={onItemClick}
              onContextMenu={onContextMenu}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  folders,
  setFolders,
  onContextMenu,
  onSelectFile,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [draggingItem, setDraggingItem] = useState<DragInfo | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

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
    (e: React.MouseEvent, item: FolderStructure) => {
      e.preventDefault();
      onContextMenu(e, item.type, item.id);
    },
    [onContextMenu]
  );

  const handleDragStart = useCallback(
    (item: FolderStructure, depth: number) => {
      setDraggingItem({ item, depth });
    },
    []
  );

  const handleDragEnd = useCallback(
    (e: MouseEvent, info: PanInfo) => {
      if (!draggingItem || !sidebarRef.current) return;

      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      const dropTarget = elements.find((el) =>
        el.hasAttribute("data-folder-id")
      ) as HTMLElement | undefined;

      if (dropTarget) {
        const targetId = dropTarget.getAttribute("data-folder-id");
        if (targetId && targetId !== draggingItem.item.id) {
          setFolders((prevFolders) => {
            const updatedFolders = [...prevFolders];
            const draggedItem = findAndRemoveItem(
              updatedFolders,
              draggingItem.item.id
            );
            if (draggedItem) {
              addItemToFolder(updatedFolders, targetId, draggedItem);
            }
            return updatedFolders;
          });
        }
      }

      setDraggingItem(null);
    },
    [draggingItem, setFolders]
  );

  const findAndRemoveItem = (
    items: FolderStructure[],
    id: string
  ): FolderStructure | null => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        return items.splice(i, 1)[0];
      }
      if (items[i].type === "folder" && items[i].children) {
        const found = findAndRemoveItem(items[i].children || [], id);
        if (found) return found;
      }
    }
    return null;
  };

  const addItemToFolder = (
    items: FolderStructure[],
    folderId: string,
    item: FolderStructure
  ) => {
    for (const folder of items) {
      if (folder.id === folderId && folder.type === "folder") {
        folder.children = folder.children || [];
        folder.children.push({ ...item, parentId: folder.id });
        return true;
      }
      if (folder.type === "folder" && folder.children) {
        if (addItemToFolder(folder.children, folderId, item)) return true;
      }
    }
    return false;
  };

  return (
    <div
      ref={sidebarRef}
      className="w-64 h-full overflow-y-auto border-r border-white border-opacity-20 p-4"
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e, "folder", null);
      }}
    >
      <h2 className="text-xl font-semibold mb-4">Files</h2>
      {folders.map((folder) => (
        <SidebarItem
          key={folder.id}
          item={folder}
          depth={0}
          isExpanded={expandedFolders.has(folder.id)}
          onToggle={toggleFolder}
          onItemClick={handleItemClick}
          onContextMenu={handleContextMenu}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
};

export default Sidebar;
