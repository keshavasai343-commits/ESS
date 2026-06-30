import { useState, useCallback } from "react";
import { FileText, Upload, Download, File, Image, FileSpreadsheet } from "lucide-react";
import { useDocuments, useUploadDocument, useDownloadDocument } from "@/hooks/useDocuments";

const fileIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  png: Image,
  jpg: Image,
  jpeg: Image,
  doc: File,
  docx: File,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
};

function formatSize(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const { data: documents, isLoading } = useDocuments();
  const upload = useUploadDocument();
  const download = useDownloadDocument();
  const [category, setCategory] = useState("general");
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) upload.mutate({ file, category });
    },
    [category, upload]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload.mutate({ file, category });
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-500 mt-1">Upload and manage your documents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            className={`bg-white rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              dragActive ? "border-primary-500 bg-primary-50" : "border-gray-300"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <Upload size={40} className="mx-auto text-gray-400 mb-3" />
            <p className="font-medium text-gray-700">
              Drag & drop a file here, or{" "}
              <label className="text-primary-600 cursor-pointer hover:underline">
                browse
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                />
              </label>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PDF, PNG, JPG, DOC, XLS — Max 10MB
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <label className="text-xs text-gray-500">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-xs px-2 py-1 border border-gray-300 rounded outline-none"
              >
                <option value="general">General</option>
                <option value="pan">PAN Card</option>
                <option value="aadhaar">Aadhaar Card</option>
                <option value="form16">Form 16</option>
                <option value="certificate">Certificate</option>
                <option value="offer_letter">Offer Letter</option>
              </select>
            </div>
            {upload.isPending && (
              <p className="text-sm text-primary-600 mt-3">Uploading...</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Documents</span>
              <span className="font-medium">{documents?.length ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Size</span>
              <span className="font-medium">
                {formatSize(documents?.reduce((s, d) => s + (d.file_size || 0), 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">My Documents</h2>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {documents?.map((doc) => {
              const Icon = fileIcons[doc.file_type || ""] || File;
              return (
                <div
                  key={doc.id}
                  className="px-6 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {doc.original_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatSize(doc.file_size)} · {doc.category} · {doc.uploaded_at}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      download.mutate({ id: doc.id, filename: doc.original_name })
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                </div>
              );
            })}
            {!documents?.length && (
              <div className="p-8 text-center text-gray-400">
                No documents uploaded yet
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
