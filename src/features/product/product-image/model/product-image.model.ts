// Image Product Models - Frontend Implementation

export interface ImageProduct {
  idImageProduct: number;
  urlImage: string;
  product: Product;
}

export interface Product {
  id: string;
}