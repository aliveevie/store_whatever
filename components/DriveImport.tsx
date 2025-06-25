import React, { useState } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";

export const DriveImport = () => {
  const [driveLink, setDriveLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { uploadFileMutation, uploadedInfo, handleReset, status, progress } = useFileUpload();
  const { isPending: isLoading, mutateAsync: uploadFile } = uploadFileMutation;

  // Extract file ID from Google Drive link
  function extractFileId(url: string): string | null {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : null;
  }

  // Fetch file from Google Drive (publicly shared) via proxy
  async function fetchDriveFile(fileId: string): Promise<File> {
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const proxyRes = await fetch("/api/proxy-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: downloadUrl }),
    });
    if (!proxyRes.ok) throw new Error("Failed to fetch file from Google Drive (proxy). Make sure the link is public.");
    const blob = await proxyRes.blob();
    // Try to get filename from headers, fallback to fileId
    let filename = fileId;
    const contentDisp = proxyRes.headers.get("content-disposition");
    if (contentDisp) {
      const match = contentDisp.match(/filename="(.+)"/);
      if (match) filename = match[1];
    }
    return new File([blob], filename);
  }

  const handleImport = async () => {
    setError(null);
    setFile(null);
    handleReset();
    const fileId = extractFileId(driveLink);
    if (!fileId) {
      setError("Invalid Google Drive link.");
      return;
    }
    try {
      const fetchedFile = await fetchDriveFile(fileId);
      setFile(fetchedFile);
      await uploadFile(fetchedFile);
    } catch (err: any) {
      setError(err.message || "Failed to import file from Drive.");
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold mb-2">Import from Google Drive</h2>
      <input
        type="text"
        placeholder="Paste Google Drive file link"
        className="w-full px-3 py-2 border rounded"
        value={driveLink}
        onChange={e => setDriveLink(e.target.value)}
        disabled={isLoading}
      />
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white font-semibold disabled:opacity-60"
        onClick={handleImport}
        disabled={!driveLink || isLoading}
      >
        {isLoading ? "Importing..." : "Import & Upload"}
      </button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {status && <div className="text-sm text-blue-600">{status}</div>}
      {progress > 0 && isLoading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      {uploadedInfo && !isLoading && (
        <div className="mt-4 bg-background border border-border rounded-xl p-4 text-left w-full">
          <h4 className="font-semibold mb-2 text-foreground">File Upload Details</h4>
          <div className="text-sm text-foreground">
            <div><span className="font-medium">File name:</span> {uploadedInfo.fileName}</div>
            <div><span className="font-medium">File size:</span> {uploadedInfo.fileSize?.toLocaleString() || "N/A"} bytes</div>
            <div className="break-all"><span className="font-medium">CommP:</span> {uploadedInfo.commp}</div>
            <div className="break-all"><span className="font-medium">Tx Hash:</span> {uploadedInfo.txHash}</div>
          </div>
        </div>
      )}
    </div>
  );
}; 