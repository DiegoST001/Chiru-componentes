// Comment Models - Frontend Implementation

export interface Comment {
  id: number;
  content: string;
  request: Request;
  supplier: Supplier | null;
  createdAt: string;
  updatedAt: string;
}

export interface Request {
  id: number;
}

export interface Supplier {
  id: string;
}

export interface CreateCommentDto {
  content: string;
  requestId: number;
  supplierId: string;
}

export interface UpdateCommentContentDto {
  content: string;
}