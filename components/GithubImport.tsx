import React, { useState } from "react";
import JSZip from "jszip";
import { useFileUpload } from "@/hooks/useFileUpload";

export const GithubImport = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { uploadFileMutation, uploadedInfo, handleReset, status, progress } = useFileUpload();
  const { isPending: isLoading, mutateAsync: uploadFile } = uploadFileMutation;

  // Extract owner and repo from URL
  function parseGithubUrl(url: string): { owner: string; repo: string } | null {
    const match = url.match(/github.com\/(.+?)\/(.+?)(?:$|\/|\?)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2] };
  }

  // Fetch repo as zip and extract first file via proxy
  async function fetchRepoFile(owner: string, repo: string): Promise<File> {
    const zipUrl = `https://codeload.github.com/${owner}/${repo}/zip/refs/heads/main`;
    const proxyRes = await fetch("/api/proxy-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: zipUrl }),
    });
    if (!proxyRes.ok) throw new Error("Failed to fetch repo zip (proxy). Make sure the repo exists and is public.");
    const blob = await proxyRes.blob();
    const zip = await JSZip.loadAsync(blob);
    // Find the first file (not directory)
    let firstFile: JSZip.JSZipObject | null = null;
    zip.forEach((relativePath, file) => {
      if (!file.dir && !firstFile) firstFile = file;
    });
    if (!firstFile) throw new Error("No files found in repo.");
    const fileData = await firstFile.async("blob");
    // Remove the repo folder prefix from filename
    const parts = firstFile.name.split("/");
    const filename = parts.slice(1).join("/") || firstFile.name;
    return new File([fileData], filename);
  }

  const handleImport = async () => {
    setError(null);
    setFile(null);
    handleReset();
    const parsed = parseGithubUrl(repoUrl);
    if (!parsed) {
      setError("Invalid GitHub repo URL.");
      return;
    }
    try {
      const fetchedFile = await fetchRepoFile(parsed.owner, parsed.repo);
      setFile(fetchedFile);
      await uploadFile(fetchedFile);
    } catch (err: any) {
      setError(err.message || "Failed to import file from GitHub.");
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold mb-2">Import from GitHub</h2>
      <input
        type="text"
        placeholder="Paste GitHub repo link (e.g. https://github.com/user/repo)"
        className="w-full px-3 py-2 border rounded"
        value={repoUrl}
        onChange={e => setRepoUrl(e.target.value)}
        disabled={isLoading}
      />
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white font-semibold disabled:opacity-60"
        onClick={handleImport}
        disabled={!repoUrl || isLoading}
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