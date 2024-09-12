// /root/app/apps/obsidian/components/Editor.tsx
import React, { useState, useEffect } from "react";
import { EditorProps } from "../types";

const Editor: React.FC<EditorProps> = ({ selectedFile }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (selectedFile && selectedFile.type === "file") {
      setContent(selectedFile.content || "");
    } else {
      setContent("");
    }
  }, [selectedFile]);

  return (
    <div className="flex-grow p-4">
      {selectedFile && selectedFile.type === "file" ? (
        <>
          <h2 className="text-xl font-semibold mb-4">{selectedFile.name}</h2>
          <textarea
            className="w-full h-full bg-black bg-opacity-30 text-white p-4 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          Select a file to edit
        </div>
      )}
    </div>
  );
};

export default Editor;
