// /root/app/apps/flow/components/FlowDesigner.tsx
import React, { useState } from "react";

const FlowDesigner: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const elements = ["Background", "Dock", "Window", "Button", "Text", "Icon"];

  return (
    <div className="flow-designer p-6 flex">
      <div className="element-list w-1/4 pr-4 border-r border-white border-opacity-20">
        <h2 className="text-xl font-semibold mb-4 text-white">Elements</h2>
        <ul>
          {elements.map((element) => (
            <li
              key={element}
              className={`cursor-pointer p-2 rounded-md transition-colors ${
                selectedElement === element
                  ? "bg-white bg-opacity-20"
                  : "hover:bg-white hover:bg-opacity-10"
              }`}
              onClick={() => setSelectedElement(element)}
            >
              {element}
            </li>
          ))}
        </ul>
      </div>
      <div className="design-canvas flex-grow pl-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Canvas</h2>
        {selectedElement ? (
          <div className="bg-white bg-opacity-10 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Edit {selectedElement}</h3>
            <p className="text-sm opacity-70">
              Design options for {selectedElement} will appear here.
            </p>
          </div>
        ) : (
          <p className="text-sm opacity-70">
            Select an element to begin designing.
          </p>
        )}
      </div>
    </div>
  );
};

export default FlowDesigner;
