import React, { useState } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";

export const YoutubeImport = () => {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { uploadFileMutation, uploadedInfo, handleReset, status, progress } = useFileUpload();
  const { isPending: isLoading, mutateAsync: uploadFile } = uploadFileMutation;

  // Extract video ID from YouTube link
  function extractVideoId(url: string): string | null {
    const match = url.match(/(?:v=|youtu.be\/)([\w-]{11})/);
    return match ? match[1] : null;
  }

  // Fetch video file via proxy (requires backend support for youtube-dl or similar)
  async function fetchYoutubeVideo(videoId: string): Promise<File> {
    // This endpoint should trigger a backend process to download the video and return it as a file
    const proxyRes = await fetch("/api/proxy-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}` }),
    });
    if (!proxyRes.ok) throw new Error("Failed to fetch YouTube video (proxy). Only public videos are supported.");
    const blob = await proxyRes.blob();
    let filename = videoId + ".mp4";
    const contentDisp = proxyRes.headers.get("content-disposition");
    if (contentDisp) {
      const match = contentDisp.match(/filename="(.+)"/);
      if (match) filename = match[1];
    }
    return new File([blob], filename);
  }

  const handleImport = async () => {
    setError(null);
    handleReset();
    const videoId = extractVideoId(youtubeLink);
    if (!videoId) {
      setError("Invalid YouTube link.");
      return;
    }
    try {
      const fetchedFile = await fetchYoutubeVideo(videoId);
      await uploadFile(fetchedFile);
    } catch (err: any) {
      setError(err.message || "Failed to import video from YouTube.");
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold mb-2">Import from YouTube</h2>
      <input
        type="text"
        placeholder="Paste YouTube video link"
        className="w-full px-3 py-2 border rounded"
        value={youtubeLink}
        onChange={e => setYoutubeLink(e.target.value)}
        disabled={isLoading}
      />
      <button
        className="px-4 py-2 rounded bg-red-600 text-white font-semibold disabled:opacity-60"
        onClick={handleImport}
        disabled={!youtubeLink || isLoading}
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