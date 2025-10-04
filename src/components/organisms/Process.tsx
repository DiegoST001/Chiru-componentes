import React from "react";
import { ChipRounder } from "../molecules/ChipRounder";

type ProcessProps = {
  steps?: React.ReactNode[]; // labels or nodes for each step
  current?: number; // 0-based index of current step
  onStepClick?: (index: number) => void;
  stepLinks?: (string | undefined)[]; // optional links per step (e.g. ['/cart','/shipping','/payment'])
  className?: string;
};

function Process({
  steps = ["1", "2", "3"],
  current = 0,
  onStepClick,
  stepLinks,
  className,
}: ProcessProps) {
  return (
    <nav
      aria-label="Linea de tiempo del proceso"
      className={`flex items-center gap-3 w-full ${className || ""}`}
    >
      {steps.map((step, idx) => {
        const completed = idx < current;
        const active = idx === current;
        const href = stepLinks?.[idx];

        const chip = (
          <ChipRounder
            checked={completed}
            active={active}
            onClick={() => onStepClick?.(idx)}
            className="select-none"
            aria-current={active ? "step" : undefined}
          >
            {step}
          </ChipRounder>
        );

        return (
          <React.Fragment key={idx}>
            <div className="flex items-center z-10">
              {href ? (
                // If a link is provided, render anchor that also triggers onStepClick
                <a
                  href={href}
                  onClick={(e) => {
                    onStepClick?.(idx);
                  }}
                  className="no-underline"
                >
                  {chip}
                </a>
              ) : (
                chip
              )}
            </div>

            {idx < steps.length - 1 && (
              <div
                aria-hidden
                className={`flex-1 h-0.5 rounded-full transition-colors duration-200 ${
                  idx < current ? "bg-gray-900" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export { Process };