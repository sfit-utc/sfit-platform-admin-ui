import React from "react";

interface ModalProp {
  state: boolean;
  children: React.ReactNode;
  className?: string;
  funcClickToBack: (b: boolean) => void;
}

export default function Modal({
  state,
  children,
  className,
  funcClickToBack,
}: ModalProp) {
  function handleClose({}: React.MouseEvent) {
    funcClickToBack(false);
  }

  function handleClickBox(e: React.MouseEvent) {
    e.stopPropagation();
  }

  if (!state) {
    return null;
  }

  return (
    <div
      className="flex justify-center items-center fixed left-0 right-0 bottom-0 top-0 bg-black/50"
      onClick={handleClose}
    >
      <div
        className={`${className} shadow p-6 rounded-md bg-white animate-scaleIn`}
        style={{
          backgroundColor: "var(--background)",
        }}
        onClick={handleClickBox}
      >
        {children}
      </div>
    </div>
  );
}
