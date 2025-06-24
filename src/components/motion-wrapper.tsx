'use client';

import { motion, type Variants } from 'framer-motion';

type MotionWrapperProps = {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
};

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function MotionWrapper({
  children,
  className,
  variants = defaultVariants,
  delay = 0,
}: MotionWrapperProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
