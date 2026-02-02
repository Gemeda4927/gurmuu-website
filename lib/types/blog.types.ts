/* =========================
   BLOG TYPES - MATCHING BACKEND SCHEMA
========================= */

export interface Blog {
  views: number;
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  category: "Technology" | "Health" | "Education" | "Community" | "Lifestyle" | "News";
  tags: string[];
  status: "draft" | "published";
  publishedAt?: string;
  isFeatured: boolean;
  coverImage?: {
    url: string;
    public_id: string;
  };
  gallery?: {
    url: string;
    public_id: string;
    uploadedAt: string;
  }[];
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// In your blog.types.ts
export type CreateBlogDTO = {
  title: string;
  content: string;
  category: "Technology" | "Health" | "Education" | "Community" | "Lifestyle" | "News";
  status: "draft" | "published";
  isFeatured: boolean;
  excerpt?: string; // Optional
  tags?: string[]; // Optional
  coverImage?: File; // Optional
  gallery?: File[]; // Optional
};

export interface UpdateBlogDTO extends Partial<CreateBlogDTO> {}

export interface PaginatedBlogs {
  blogs: Blog[];
  page: number;
  totalPages: number;
  totalBlogs: number;
}