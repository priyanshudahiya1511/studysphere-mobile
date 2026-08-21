export interface Document {
  _id: string;
  owner: string;
  title: string;
  fileUrl: string;
  publicId: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetDocumentsResponse {
  count: number;
  documents: Document[];
}
