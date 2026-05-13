export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  imageUrl?: string;
  published: boolean;
}
