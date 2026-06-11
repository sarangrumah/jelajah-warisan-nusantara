import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 12 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      }}
      exit={{
        opacity: 0,
        scale: 1.01,
        y: -8,
        transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
