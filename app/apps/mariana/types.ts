// /root/app/apps/mariana/types.ts

import { TreeViewElement as MagicUITreeViewElement } from "@/components/magicui/file-tree";

export type ItemType = "folder" | "file";

export interface ExtendedTreeViewElement extends MagicUITreeViewElement {
  type: ItemType;
  content?: string;
  children?: ExtendedTreeViewElement[];
}

export interface SidebarProps {
  elements: ExtendedTreeViewElement[];
  onSelectFile: (file: ExtendedTreeViewElement) => void;
  onContextMenu: (
    e: React.MouseEvent,
    element: ExtendedTreeViewElement
  ) => void;
}

export interface EditorProps {
  selectedFile: ExtendedTreeViewElement | null;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  element: ExtendedTreeViewElement;
  onClose: () => void;
  elements: ExtendedTreeViewElement[];
  setElements: React.Dispatch<React.SetStateAction<ExtendedTreeViewElement[]>>;
}
