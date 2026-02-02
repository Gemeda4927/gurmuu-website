import { create } from "zustand";
import { Blog } from "../types/blog.types";

interface BlogsState {
  blogs: Blog[];
  setBlogs: (blogs: Blog[]) => void;
  addBlog: (blog: Blog) => void;
  updateBlog: (blog: Blog) => void;
  removeBlog: (id: string) => void;
  // Soft delete uses isDeleted flag, not status change
  softDeleteBlog: (id: string) => void;
  restoreBlog: (id: string) => void;
}

export const useBlogsStore = create<BlogsState>(
  (set) => ({
    blogs: [],
    setBlogs: (blogs) => set({ blogs }),
    addBlog: (blog) =>
      set((state) => ({
        blogs: [blog, ...state.blogs],
      })),
    updateBlog: (updatedBlog) =>
      set((state) => ({
        blogs: state.blogs.map((b) =>
          b._id === updatedBlog._id
            ? updatedBlog
            : b
        ),
      })),
    removeBlog: (id) =>
      set((state) => ({
        blogs: state.blogs.filter(
          (b) => b._id !== id
        ),
      })),
    // SOFT DELETE - sets isDeleted flag (backend has isDeleted field)
    softDeleteBlog: (id) =>
      set((state) => ({
        blogs: state.blogs.map((b) =>
          b._id === id
            ? {
                ...b,
                isDeleted: true,
                deletedAt:
                  new Date().toISOString(),
              }
            : b
        ),
      })),
    // RESTORE - removes isDeleted flag
    restoreBlog: (id) =>
      set((state) => ({
        blogs: state.blogs.map((b) =>
          b._id === id
            ? {
                ...b,
                isDeleted: false,
                deletedAt: undefined,
              }
            : b
        ),
      })),
  })
);
