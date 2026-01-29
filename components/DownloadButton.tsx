'use client'

import { Download } from 'lucide-react'

export default function DownloadButton({ content, filename }: { content: string, filename: string }) {
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
    <button
      onClick={handleDownload}
      className="mt-2 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
    >
      <Download size={16} />
      下载卡密 (TXT)
    </button>
  )
}
