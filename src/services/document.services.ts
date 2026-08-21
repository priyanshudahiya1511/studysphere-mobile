import api from './api';
import { GetDocumentsResponse } from '../types/document.types';

export interface PickedFile {
  uri: string;
  name: string;
  type: string;
}

export const uploadDocumentService = async (
  file: PickedFile,
  title?: string,
) => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as any);
  if (title) {
    formData.append('title', title);
  }
  const response = await api.post('/api/v1/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const getDocumentByIdService = async (id: string) => {
  const response = await api.get(`/api/v1/documents/getdocumentbyid/${id}`);
  return response.data;
};

export const getDocumentsService = async (): Promise<GetDocumentsResponse> => {
  const response = await api.get('/api/v1/documents/getdocuments');
  return response.data;
};

export const deleteDocumentService = async (id: string) => {
  const response = await api.delete(`/api/v1/documents/deletedocument/${id}`);
  return response.data;
};
