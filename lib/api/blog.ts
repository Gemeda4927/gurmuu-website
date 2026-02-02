import {
  Blog,
  CreateBlogDTO,
  PaginatedBlogs,
  UpdateBlogDTO,
} from "../types/blog.types";
import api from "./api";

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

export const blogApi = {
  getAll: async (): Promise<Blog[]> => {
    const res = await api.get("/blogs");
    return res.data.blogs;
  },

  getPaginated: async (
    page = 1,
    limit = 10
  ): Promise<PaginatedBlogs> => {
    const res = await api.get(
      `/blogs?page=${page}&limit=${limit}`
    );
    return res.data;
  },

  getById: async (id: string): Promise<Blog> => {
    const res = await api.get(`/blogs/${id}`);
    return res.data.blog;
  },

  create: async (
    data: CreateBlogDTO
  ): Promise<Blog> => {
    const formData = new FormData();

    // Generate slug from title
    const slug = generateSlug(data.title);

    console.log(
      "📤 Generating slug:",
      slug,
      "from title:",
      data.title
    );

    // Required fields
    formData.append("title", data.title.trim());
    formData.append("slug", slug); // Add the slug
    formData.append(
      "content",
      data.content.trim()
    );
    formData.append("category", data.category);
    formData.append("status", data.status);
    formData.append(
      "isFeatured",
      data.isFeatured.toString()
    );

    // Optional fields
    if (data.excerpt) {
      formData.append(
        "excerpt",
        data.excerpt.trim()
      );
    }

    if (data.tags && data.tags.length > 0) {
      formData.append(
        "tags",
        data.tags.join(",")
      );
    }

    // Files
    if (
      data.coverImage &&
      data.coverImage instanceof File
    ) {
      formData.append(
        "coverImage",
        data.coverImage
      );
    }

    // Gallery - handle array of files
    if (
      data.gallery &&
      Array.isArray(data.gallery)
    ) {
      data.gallery.forEach((file) => {
        if (file instanceof File) {
          formData.append("gallery", file);
        }
      });
    }

    // Debug log
    console.log("📤 FormData being sent to API:");
    console.log("Slug:", slug);
    for (let pair of formData.entries()) {
      const [key, value] = pair;
      console.log(
        `${key}:`,
        value instanceof File
          ? `File(${value.name}, ${value.size} bytes)`
          : value
      );
    }

    try {
      const res = await api.post(
        "/blogs",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(
        "✅ Blog created successfully:",
        res.data
      );
      return res.data.blog;
    } catch (error: any) {
      console.error("❌ Blog creation failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.data?.errors) {
        console.error(
          "Backend validation errors:",
          error.response.data.errors
        );
      }

      throw error;
    }
  },

  update: async (
    id: string,
    data: UpdateBlogDTO
  ): Promise<Blog> => {
    const formData = new FormData();

    // If title is being updated, generate new slug
    if (data.title) {
      const slug = generateSlug(data.title);
      formData.append("slug", slug);
      console.log("📤 Updating slug to:", slug);
    }

    // Add all fields that exist in the data
    Object.entries(data).forEach(
      ([key, value]) => {
        // Skip undefined or null values
        if (value === undefined || value === null)
          return;

        console.log(`Updating ${key}:`, value);

        // Type-safe handling based on key
        switch (key) {
          case "title":
          case "content":
          case "excerpt":
            // These are strings that should be trimmed
            if (typeof value === "string") {
              formData.append(key, value.trim());
            }
            break;

          case "category":
          case "status":
            // These are string enums
            formData.append(key, value as string);
            break;

          case "isFeatured":
            // Boolean value
            formData.append(
              key,
              value.toString()
            );
            break;

          case "tags":
            // Array of strings
            if (Array.isArray(value)) {
              formData.append(
                key,
                value.join(",")
              );
            }
            break;

          case "coverImage":
            // File object
            if (value instanceof File) {
              formData.append(
                "coverImage",
                value
              );
            }
            break;

          case "gallery":
            // Array of files
            if (Array.isArray(value)) {
              (value as File[]).forEach(
                (file) => {
                  if (file instanceof File) {
                    formData.append(
                      "gallery",
                      file
                    );
                  }
                }
              );
            }
            break;

          default:
            // Handle other properties safely
            if (value instanceof File) {
              formData.append(key, value);
            } else if (
              typeof value === "string"
            ) {
              formData.append(key, value.trim());
            } else if (
              typeof value === "boolean" ||
              typeof value === "number"
            ) {
              formData.append(
                key,
                value.toString()
              );
            } else if (Array.isArray(value)) {
              // If it's an array of strings, join them
              if (
                value.every(
                  (item) =>
                    typeof item === "string"
                )
              ) {
                formData.append(
                  key,
                  (value as string[]).join(",")
                );
              }
            }
            break;
        }
      }
    );

    // Debug log for update
    console.log("📤 FormData for update:");
    for (let pair of formData.entries()) {
      const [key, value] = pair;
      console.log(
        `${key}:`,
        value instanceof File
          ? `File(${value.name}, ${value.size} bytes)`
          : value
      );
    }

    try {
      const res = await api.put(
        `/blogs/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(
        "✅ Blog updated successfully:",
        res.data
      );
      return res.data.blog;
    } catch (error: any) {
      console.error("❌ Blog update failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.data?.errors) {
        console.error(
          "Backend validation errors:",
          error.response.data.errors
        );
      }

      throw error;
    }
  },

  softDelete: async (
    id: string
  ): Promise<{ message: string }> => {
    const res = await api.delete(
      `/blogs/soft/${id}`
    );
    return res.data;
  },

  restore: async (
    id: string
  ): Promise<{ message: string }> => {
    const res = await api.patch(
      `/blogs/restore/${id}`
    );
    return res.data;
  },

  hardDelete: async (
    id: string
  ): Promise<{ message: string }> => {
    const res = await api.delete(`/blogs/hard/${id}`);
    return res.data;
  },
};
