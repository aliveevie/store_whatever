import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="flex w-full items-center justify-center rounded-t-lg bg-white dark:bg-black border-t shadow-inner"
    >
      <motion.div
        variants={itemVariants}
        className="mx-auto px-4 py-5 md:px-24 lg:px-8"
      >
        <motion.div
          variants={footerVariants}
          className="flex flex-col items-center gap-3"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2"
          >
            <span className="text-xl font-extrabold tracking-tight text-blue-600">store</span>
            <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">whatever</span>
          </motion.div>
          <motion.p variants={itemVariants} className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            &copy; {new Date().getFullYear()} storewhatever. All rights reserved.
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
}
