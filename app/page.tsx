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
import { FaDatabase, FaCloudUploadAlt, FaGoogleDrive, FaCodeBranch, FaShieldAlt } from "react-icons/fa";
import { DriveImport } from "@/components/DriveImport";
import { GithubImport } from "@/components/GithubImport";

// Professional tab names
const TABS = [
  { key: "my-storage", label: "My Storage", icon: <FaDatabase size={18} /> },
  { key: "upload", label: "Upload", icon: <FaCloudUploadAlt size={18} /> },
  { key: "add-drive", label: "Add from Drive", icon: <FaGoogleDrive size={18} /> },
  { key: "add-repo", label: "Add Repo", icon: <FaCodeBranch size={18} /> },
  { key: "proof-set", label: "Proof Sets", icon: <FaShieldAlt size={18} /> },
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

  // Demo values for the Storage Status card
  const fil = balances?.filBalanceFormatted || 100;
  const usdfc = balances?.usdfcBalanceFormatted || 4.9;
  const pandora = 0.129;
  const rate = 10;
  const storageUsed = 0;
  const storageMax = 10;
  const daysLeft = 132.4;
  const efficiency = "Optimal";
  const nextRenewal = "4+ months";

  return (
    <div className="w-full flex flex-col justify-center min-h-fit bg-[#f7f9fb]">
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
      <main className="flex flex-col items-center w-full mx-auto pt-10 pb-20">
        {/* Hero Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-600 text-white font-bold rounded-full px-3 py-1 text-lg shadow">s</span>
            <span className="text-2xl font-bold tracking-tight text-gray-900">store <span className="text-blue-600">whatever</span></span>
          </div>
          <div className="text-center text-lg text-gray-700 font-medium max-w-2xl mb-2">
            Store anything you want: files, code, or cloud data. Secure, decentralized, and easy to use.
          </div>
          <div className="text-center text-sm text-gray-400 mb-4">Powered by Filecoin and Synapse SDK</div>
          <div className="flex flex-col items-center">
            <div className="bg-white border border-gray-200 rounded-xl shadow px-8 py-4 mb-2">
              <div className="text-gray-500 text-xs mb-1">Your USDFC Balance</div>
              <div className="text-2xl font-bold text-blue-600">{isLoadingBalances || !isConnected ? "..." : usdfc + " USDFC"}</div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="w-full max-w-3xl flex items-center bg-white border border-gray-200 rounded-xl shadow mb-8 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 flex-1 justify-center py-3 px-4 text-base font-semibold border-b-2 transition-colors whitespace-nowrap
                ${activeTab === tab.key
                  ? "border-blue-600 text-blue-700 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-blue-600 hover:bg-gray-50"}
              `}
              style={{ minWidth: 120 }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            {activeTab === "my-storage" && (
              <motion.div
                key="my-storage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Wallet Balances Card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow p-6 flex flex-col gap-4">
                  <div className="text-lg font-bold text-gray-900 mb-1">Wallet Balances</div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">FIL Balance</span>
                      <span className="font-semibold text-gray-900">{fil} FIL</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">USDFC Balance</span>
                      <span className="font-semibold text-gray-900">{usdfc} USDFC</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Pandora Balance</span>
                      <span className="font-semibold text-gray-900">{pandora} USDFC</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Rate Allowance</span>
                      <span className="font-semibold text-gray-900">{rate} GB</span>
                    </div>
                  </div>
                </div>
                {/* Storage Status Card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow p-6 flex flex-col gap-4">
                  <div className="text-lg font-bold text-gray-900 mb-1">Storage Status</div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 font-medium">Storage Usage</span>
                    <span className="font-semibold text-gray-900">{storageUsed} GB / {storageMax} GB</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full mb-3">
                    <div className="h-3 bg-blue-500 rounded-full" style={{ width: `${(storageUsed / storageMax) * 100}%` }} />
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex flex-col items-center mb-2">
                    <div className="text-xs text-gray-500 mb-1">Persistence Status</div>
                    <div className="text-2xl font-bold text-green-600">{daysLeft} days</div>
                    <div className="text-xs text-gray-400">Days left at max usage</div>
                    <div className="text-xs text-gray-400">Max rate: {storageMax} GB</div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-400 mb-1">Efficiency</span>
                      <span className="font-semibold text-gray-900">{efficiency}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-400 mb-1">Next Renewal</span>
                      <span className="font-semibold text-gray-900">{nextRenewal}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white border border-gray-200 rounded-2xl shadow p-6"
              >
                <FileUploader />
              </motion.div>
            )}
            {activeTab === "add-drive" && (
              <motion.div
                key="add-drive"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white border border-gray-200 rounded-2xl shadow p-6 flex flex-col items-center justify-center min-h-[200px] text-center"
              >
                <DriveImport />
              </motion.div>
            )}
            {activeTab === "add-repo" && (
              <motion.div
                key="add-repo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white border border-gray-200 rounded-2xl shadow p-6 flex flex-col items-center justify-center min-h-[200px] text-center"
              >
                <GithubImport />
              </motion.div>
            )}
            {activeTab === "proof-set" && (
              <motion.div
                key="proof-set"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white border border-gray-200 rounded-2xl shadow p-6"
              >
                <ViewProofSets />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
