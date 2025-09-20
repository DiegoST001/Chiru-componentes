import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { cntl } from "@/utils/cntl";
import { CaretCircleDoubleLeft, CaretCircleDoubleRight } from "phosphor-react";

type ScrollProps = {
  children: React.ReactNode;
  direction?: "horizontal" | "vertical";
  infinite?: boolean;
  speed?: number;
  withControls?: boolean;
  step?: number;
  size?: string;
  className?: string;
  pauseOnHover?: boolean;
  autoResumeDelay?: number; // tiempo en ms para reanudar animación después de interacción
};

function ScrollOrg({
  children,
  direction = "horizontal",
  infinite = false,
  speed = 30,
  withControls = false,
  step = 200,
  size = "auto",
  className,
  pauseOnHover = true,
  autoResumeDelay = 3000, // 3 segundos
}: ScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

  function scrollByStep(offset: number) {
    if (containerRef.current) {
      if (direction === "horizontal") {
        containerRef.current.scrollBy({ left: offset, behavior: "smooth" });
      } else {
        containerRef.current.scrollBy({ top: offset, behavior: "smooth" });
      }
    }
  }

  function handleUserInteraction() {
    if (!infinite) return;
    setPaused(true);
    if (resumeTimeout) clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => setPaused(false), autoResumeDelay);
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !infinite) return;

    el.addEventListener("scroll", handleUserInteraction, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleUserInteraction);
      if (resumeTimeout) clearTimeout(resumeTimeout);
    };
  }, [infinite]);

  const wrapperClasses = cntl`
    relative
    flex
    ${direction === "horizontal" ? "flex-row gap-4" : "flex-col gap-4"}
    ${className || ""}
  `;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Botón izquierdo */}
      {withControls && (
        <Button
          variant="ghost"
          size="small"
          onClick={() => scrollByStep(-step)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
        >
          <CaretCircleDoubleLeft size={24} />
        </Button>
      )}

      <div
        ref={containerRef}
        className={wrapperClasses}
        style={{
          width: size,
          overflowX: direction === "horizontal" ? "auto" : "hidden",
          overflowY: direction === "vertical" ? "auto" : "hidden",
          WebkitOverflowScrolling: "touch",
          animation:
            infinite && !paused
              ? `${direction === "horizontal" ? "marqueeX" : "marqueeY"} ${speed}s linear infinite`
              : undefined,
          animationPlayState: paused ? "paused" : "running",
        }}
        onMouseEnter={() => pauseOnHover && setPaused(true)}
        onMouseLeave={() => pauseOnHover && setPaused(false)}
      >
        {infinite ? (
          <>
            {children}
            {children} {/* duplicación para bucle */}
          </>
        ) : (
          children
        )}
      </div>

      {/* Botón derecho */}
      {withControls && (
        <Button
          variant="primary"
          size="small"
          onClick={() => scrollByStep(step)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
        >
          <CaretCircleDoubleRight size={24} />
        </Button>
      )}
    </div>
  );
}

export default ScrollOrg;
export type { ScrollProps };
