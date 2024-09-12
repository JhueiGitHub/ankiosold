// /root/app/apps/obsidian/types.ts

import { PanInfo } from "framer-motion";

export type ItemType = "folder" | "file";

export interface FolderStructure {
  id: string;
  name: string;
  type: ItemType;
  children?: FolderStructure[];
  content?: string;
  parentId?: string | null;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  type: ItemType;
  parentId: string | null;
  onClose: () => void;
  folders: FolderStructure[];
  setFolders: React.Dispatch<React.SetStateAction<FolderStructure[]>>;
}

export interface SidebarProps {
  folders: FolderStructure[];
  setFolders: React.Dispatch<React.SetStateAction<FolderStructure[]>>;
  onContextMenu: (
    e: React.MouseEvent,
    type: ItemType,
    parentId: string | null
  ) => void;
  onSelectFile: (file: FolderStructure) => void;
}

export interface EditorProps {
  selectedFile: FolderStructure | null;
}

export interface DragItem {
  id: string;
  type: ItemType;
}

export interface DragInfo {
  item: FolderStructure;
  depth: number;
}
