"use client";
import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { useFileUpload } from "@/hooks/useFileUpload";

export const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useAccount();

  const { uploadFileMutation, uploadedInfo, handleReset, status, progress } =
    useFileUpload();

  const { isPending: isLoading, mutateAsync: uploadFile } = uploadFileMutation;

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }, []);

  // Defensive: Reset error on file change
  const handleFileChange = (file: File | null) => {
    setFile(file);
    setError(null);
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="mt-4 p-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <input
          id="fileInput"
          type="file"
          onChange={(e) => {
            e.target.files && handleFileChange(e.target.files[0]);
            e.target.value = "";
          }}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <svg
            className={`w-10 h-10 ${isDragging ? "text-blue-500" : "text-gray-400"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-lg font-medium">
            {file ? file.name : "Drop your file here, or click to select"}
          </p>
          {!file && (
            <p className="text-sm text-gray-500">
              Drag and drop your file, or click to browse
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={async () => {
            if (!file) return;
            setError(null);
            try {
              await uploadFile(file);
            } catch (err: any) {
              // Defensive: Show user-friendly error for MetaMask/network issues
              if (err?.message?.includes("Internal JSON-RPC error")) {
                setError(
                  "MetaMask RPC Error: Please check your network, contract address, and ensure you are connected to the Filecoin Calibration network."
                );
              } else if (err?.message) {
                setError(err.message);
              } else {
                setError("An unknown error occurred. Please try again.");
              }
            }
          }}
          disabled={!file || isLoading || !!uploadedInfo}
          aria-disabled={!file || isLoading}
          className={`px-6 py-2 rounded-[20px] text-center border-2 transition-all
            ${
              !file || isLoading || uploadedInfo
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-secondary text-secondary hover:bg-secondary/70 hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 hover:border-secondary/70 hover:cursor-pointer"
            }
          `}
        >
          {isLoading ? "Uploading..." : !uploadedInfo ? "Submit" : "Submitted"}
        </button>
        <button
          onClick={() => {
            handleReset();
            setFile(null);
            setError(null);
          }}
          disabled={!file || isLoading}
          aria-disabled={!file || isLoading}
          className={`px-6 py-2 rounded-[20px] text-center border-2 transition-all
            ${
              !file || isLoading
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-secondary text-secondary hover:bg-secondary/70 hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 hover:border-secondary/70 hover:cursor-pointer"
            }
          `}
        >
          Reset
        </button>
      </div>
      {/* Error message display */}
      {error && (
        <div className="mt-4 text-center">
          <p className="text-sm text-red-600 font-semibold">{error}</p>
        </div>
      )}
      {status && (
        <div className="mt-4 text-center">
          <p
            className={`text-sm
              ${
                status.includes("❌")
                  ? "text-red-500"
                  : status.includes("✅") || status.includes("🎉")
                    ? "text-green-500"
                    : "text-secondary"
              }
            `}
          >
            {status}
          </p>
          {isLoading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 ">
              <div
                className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
      {/* Uploaded file info panel */}
      {uploadedInfo && !isLoading && (
        <div className="mt-6 bg-background border border-border rounded-xl p-4 text-left">
          <h4 className="font-semibold mb-2 text-foreground">
            File Upload Details
          </h4>
          <div className="text-sm text-foreground">
            <div>
              <span className="font-medium">File name:</span>{" "}
              {uploadedInfo.fileName}
            </div>
            <div>
              <span className="font-medium">File size:</span>{" "}
              {uploadedInfo.fileSize?.toLocaleString() || "N/A"} bytes
            </div>
            <div className="break-all">
              <span className="font-medium">CommP:</span> {uploadedInfo.commp}
            </div>
            <div className="break-all">
              <span className="font-medium">Tx Hash:</span>{" "}
              {uploadedInfo.txHash}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
