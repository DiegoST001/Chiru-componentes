// Service Image Models - Frontend Implementation

export interface ServiceImage {
  idImageService: number;
  urlImage: string;
  service: ServiceRef;
}

export interface ServiceRef {
  id: number;
}