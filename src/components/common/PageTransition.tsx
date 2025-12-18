import { ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
    children: ReactNode;
}

const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

/**
 * Page transition wrapper component
 */
export const PageTransition = ({ children }: PageTransitionProps) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

/**
 * Simple fade transition
 */
export const FadeIn = ({ children }: { children: ReactNode }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        {children}
    </motion.div>
);

/**
 * Stagger children animation container
 */
export const StaggerContainer = ({ children }: { children: ReactNode }) => (
    <motion.div
        initial="hidden"
        animate="visible"
        variants={{
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1,
                },
            },
        }}
    >
        {children}
    </motion.div>
);

/**
 * Stagger item for use inside StaggerContainer
 */
export const StaggerItem = ({ children }: { children: ReactNode }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4 },
            },
        }}
    >
        {children}
    </motion.div>
);
