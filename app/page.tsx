"use client";
import { StorageManager } from "../components/StorageManager";
import { useAccount } from "wagmi";
import { useState } from "react";
import { FileUploader } from "../components/FileUploader";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "@/components/ui/Confetti";
import { useConfetti } from "@/hooks/useConfetti";
import { ViewProofSets } from "@/components/ViewProofSets";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useBalances } from "@/hooks/useBalances";

// Professional tab names
const TABS = [
  { key: "my-storage", label: "My Storage" },
  { key: "upload", label: "Upload" },
  { key: "add-drive", label: "Add from Drive" },
  { key: "add-repo", label: "Add Repo" },
  { key: "proof-set", label: "Proof Sets" },
] as const;
type Tab = typeof TABS[number]["key"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "smooth",
    },
  },
};

export default function Home() {
  const { isConnected, chainId } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>("my-storage");
  const { showConfetti } = useConfetti();
  const { data: balances, isLoading: isLoadingBalances } = useBalances();

  return (
    <div className="w-full flex flex-col justify-center min-h-fit">
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center my-10 w-full mx-auto"
      >
        {/* Hero Section */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="text-4xl font-extrabold tracking-tight text-blue-600 flex items-center gap-2 mb-2"
        >
          store<span className="text-gray-900 dark:text-white">whatever</span>
        </motion.div>
        <motion.p
          variants={itemVariants}
          className="text-base font-medium text-gray-600 dark:text-gray-300 mb-4 text-center max-w-2xl"
        >
          Store anything you want: files, code, or cloud data. Secure, decentralized, and easy to use. Powered by Filecoin and Synapse SDK.
        </motion.p>
        <motion.p
          variants={itemVariants}
          className="text-base font-medium text-gray-500 dark:text-gray-400 mb-2 text-center"
        >
          Your USDFC balance: {isLoadingBalances || !isConnected ? "..." : balances?.usdfcBalanceFormatted.toFixed(1) + " $"}
        </motion.p>
        {chainId !== 314159 && (
          <motion.p
            variants={itemVariants}
            className="text-base font-semibold text-red-600 bg-red-50 dark:bg-red-900/60 rounded p-2 mb-2 text-center"
          >
            ⚠️ Please use the Filecoin Calibration network.
          </motion.p>
        )}
        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div
              key="connect"
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="flex flex-col items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ConnectButton />
              </motion.div>
              <motion.p variants={itemVariants} className="mt-3 text-secondary">
                Please connect your wallet to use storewhatever
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={itemVariants}
              className="mt-3 max-w-5xl w-full border-1 rounded-lg p-8 bg-white dark:bg-neutral-900 shadow-lg"
            >
              {/* Tabs */}
              <motion.div variants={itemVariants} className="flex mb-6 gap-2 flex-wrap">
                {TABS.map((tab) => (
                  <motion.button
                    key={tab.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-2 px-4 text-center border-b-2 transition-colors rounded-t-md font-semibold text-base ${
                      activeTab === tab.key
                        ? "border-blue-600 text-blue-700 bg-blue-50 dark:bg-blue-900 dark:text-blue-200"
                        : "border-transparent text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </motion.div>
              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "my-storage" && (
                  <motion.div
                    key="my-storage"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <StorageManager />
                  </motion.div>
                )}
                {activeTab === "upload" && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: +20 }}
                    transition={{ type: "smooth" }}
                  >
                    <FileUploader />
                  </motion.div>
                )}
                {activeTab === "add-drive" && (
                  <motion.div
                    key="add-drive"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: +20 }}
                    transition={{ type: "smooth" }}
                    className="flex flex-col items-center justify-center min-h-[200px] text-center"
                  >
                    <h2 className="text-xl font-semibold mb-2">Add from Drive</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Connect your Google Drive or Dropbox to import files. (Coming soon)</p>
                    <button className="px-4 py-2 rounded bg-blue-600 text-white font-semibold opacity-60 cursor-not-allowed" disabled>
                      Connect Cloud Storage
                    </button>
                  </motion.div>
                )}
                {activeTab === "add-repo" && (
                  <motion.div
                    key="add-repo"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: +20 }}
                    transition={{ type: "smooth" }}
                    className="flex flex-col items-center justify-center min-h-[200px] text-center"
                  >
                    <h2 className="text-xl font-semibold mb-2">Add Repository</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Store code from your GitHub or GitLab repositories. (Coming soon)</p>
                    <input type="text" placeholder="Paste repo URL (e.g. https://github.com/user/repo)" className="w-full max-w-md px-3 py-2 border rounded mb-2" disabled />
                    <button className="px-4 py-2 rounded bg-blue-600 text-white font-semibold opacity-60 cursor-not-allowed" disabled>
                      Import Repository
                    </button>
                  </motion.div>
                )}
                {activeTab === "proof-set" && (
                  <motion.div
                    key="proof-set"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <ViewProofSets />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
