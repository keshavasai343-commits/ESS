import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as docApi from "@/api/documents";

export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: docApi.getDocuments,
  });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, category }: { file: File; category: string }) =>
      docApi.uploadDocument(file, category),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });
}

export function useDownloadDocument() {
  return useMutation({
    mutationFn: ({ id, filename }: { id: number; filename: string }) =>
      docApi.downloadDocument(id).then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      }),
  });
}
