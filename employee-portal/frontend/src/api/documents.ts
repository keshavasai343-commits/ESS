import api from "./client";
import type { Document } from "@/types";

export const getDocuments = () =>
  api.get<Document[]>("/documents").then((r) => r.data);

export const uploadDocument = (file: File, category: string) => {
  const form = new FormData();
  form.append("file", file);
  form.append("category", category);
  return api.post<Document>("/documents/upload", form).then((r) => r.data);
};

export const downloadDocument = (id: number) =>
  api.get(`/documents/${id}/download`, { responseType: "blob" }).then((r) => r.data);
