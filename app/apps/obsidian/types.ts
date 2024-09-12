// /root/app/apps/obsidian/types.ts

export type ItemType = "folder" | "file";

export interface FolderStructure {
  id: string;
  name: string;
  type: ItemType;
  children?: FolderStructure[];
  content?: string;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  type: ItemType;
  onClose: () => void;
  folders: FolderStructure[];
  setFolders: React.Dispatch<React.SetStateAction<FolderStructure[]>>;
}

export interface SidebarProps {
  folders: FolderStructure[];
  setFolders: React.Dispatch<React.SetStateAction<FolderStructure[]>>;
  onContextMenu: (e: React.MouseEvent, item: FolderStructure) => void;
  onSelectFile: (file: FolderStructure) => void;
}

export interface EditorProps {
  selectedFile: FolderStructure | null;
}
