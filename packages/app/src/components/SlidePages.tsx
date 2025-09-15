import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

type SlidePagesProps = {
  currentPage: string;
  direction: number;
  children: ReactNode;
  gap?: number;
  className?: string;
};

export default function SlidePages({
  currentPage,
  direction,
  children,
  gap = 28,
  className = "",
}: SlidePagesProps) {
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? `calc(100% + ${gap}px)` : `calc(-100% - ${gap}px)`,
      opacity: 1,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
    },
    exit: (direction: number) => ({
      x: direction > 0 ? `calc(-100% - ${gap}px)` : `calc(100% + ${gap}px)`,
      opacity: 1,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
    }),
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <AnimatePresence mode="sync" custom={direction}>
        <motion.div
          key={currentPage}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.15, 1, 0.3, 1] }}
          className="absolute w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
