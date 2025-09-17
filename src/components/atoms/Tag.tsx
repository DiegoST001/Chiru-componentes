import React from "react";
import { X } from "phosphor-react";
import { cntl } from "@/utils/cntl";

type TagProps = React.HTMLAttributes<HTMLDivElement> & {
  text: string;
  onRemove?: () => void;
};

function Tag({ text, onRemove, ...props }: TagProps) {
  return (
    <div
      className={cntl`inline-flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-sm`}
      {...props}
    >
      <span>{text}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-0.5 hover:bg-gray-300 rounded-full"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export { Tag };
