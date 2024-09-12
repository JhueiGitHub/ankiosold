// /root/app/os/components/AppWindow.tsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

interface WindowProps {
  id: string;
  title: string;
  appName: string;
  onClose: () => void;
  windowStyle?: "fullscreen" | "centered";
}

const Window: React.FC<WindowProps> = ({
  id,
  title,
  appName,
  onClose,
  windowStyle = "fullscreen",
}) => {
  const [isMinimizing, setIsMinimizing] = useState(false);
  const controls = useAnimation();
  const windowRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [internalPath, setInternalPath] = useState("");

  useEffect(() => {
    if (pathname.startsWith(`/apps/${appName.toLowerCase()}`)) {
      setInternalPath(
        pathname.replace(`/apps/${appName.toLowerCase()}`, "") || "/"
      );
    }
  }, [pathname, appName]);

  const AppComponent = dynamic(
    () => import(`@/app/apps/${appName.toLowerCase()}/page`),
    {
      loading: () => <p>Loading...</p>,
    }
  );

  const getIconPosition = () => {
    const dockIcon = document.getElementById(`dock-icon-${appName}`);
    if (dockIcon) {
      const rect = dockIcon.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
    return { x: 0, y: 0 };
  };

  useEffect(() => {
    const iconPosition = getIconPosition();
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      controls.set({
        scale: 0,
        x: iconPosition.x - rect.width / 2,
        y: iconPosition.y - rect.height / 2,
      });
      controls.start({
        scale: 1,
        x: 0,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      });
    }
  }, [controls, appName]);

  const handleMinimize = () => {
    setIsMinimizing(true);
    const iconPosition = getIconPosition();
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      controls
        .start({
          scale: 0,
          x: iconPosition.x - rect.width / 2,
          y: iconPosition.y - rect.height / 2,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
          },
        })
        .then(() => {
          onClose();
          setIsMinimizing(false);
        });
    }
  };

  const windowVariants = {
    fullscreen: {
      width: "100%",
      height: "100%",
      borderRadius: "0.5rem",
    },
    centered: {
      width: "80%",
      height: "80%",
      borderRadius: "1rem",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={windowRef}
        key={id}
        initial={false}
        animate={controls}
        exit={{
          scale: 0,
          ...getIconPosition(),
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
          },
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: isMinimizing ? "none" : "auto",
        }}
      >
        <motion.div
          className={`flex flex-col bg-black bg-opacity-80 overflow-hidden shadow-2xl border border-gray-900 ${appName === "obsidian" ? "obsidian-app" : ""}`}
          variants={windowVariants}
          initial={windowStyle}
          animate={windowStyle}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <div
            className="px-4 py-2 flex justify-between items-center bg-black bg-opacity-30"
            style={{
              zIndex: 40,
            }}
          >
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMinimize}
                className="w-3 h-3 rounded-full bg-yellow-500"
              />
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500"
              />
              <button className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <h2
              className="text-white text-sm font-medium text-opacity-0"
              style={{ fontFamily: "ExemplarPro" }}
            >
              {title}
            </h2>
            <div className="w-14"></div>
          </div>
          <div className="flex-1 overflow-auto">
            <AppComponent />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Window;
