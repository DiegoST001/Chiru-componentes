// Category Models - Frontend Implementation

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  parent: Category | null;
  children: Category[];
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
}