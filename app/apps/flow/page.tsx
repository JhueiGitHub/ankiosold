// /root/app/apps/flow/page.tsx
import React from "react";
import FlowDesigner from "./components/FlowDesigner";

export default function FlowApp() {
  return (
    <div className="flow-app h-full w-full flex flex-col">
      <header className="p-4 bg-black bg-opacity-30 backdrop-blur-md">
        <h1 className="text-2xl font-semibold text-white">Flow</h1>
      </header>
      <main className="flex-grow overflow-auto">
        <FlowDesigner />
      </main>
    </div>
  );
}
