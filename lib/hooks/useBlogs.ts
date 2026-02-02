import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { blogApi } from "@/lib/api/blog";
import {
  Blog,
  CreateBlogDTO,
  UpdateBlogDTO,
} from "../types/blog.types";

interface UpdateBlogVariables {
  id: string;
  data: UpdateBlogDTO;
}

export const useBlogs = () => {
  const queryClient = useQueryClient();

  // FETCH ALL BLOGS
  const blogsQuery = useQuery<Blog[], Error>({
    queryKey: ["blogs"],
    queryFn: blogApi.getAll,
  });

  // CREATE BLOG
  const createBlog = useMutation<
    Blog,
    Error,
    CreateBlogDTO
  >({
    mutationFn: (data) => blogApi.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      }),
  });

  // UPDATE BLOG
  const updateBlog = useMutation<
    Blog,
    Error,
    UpdateBlogVariables
  >({
    mutationFn: (variables) =>
      blogApi.update(
        variables.id,
        variables.data
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      }),
  });

  // SOFT DELETE BLOG
  const softDeleteBlog = useMutation<
    { message: string },
    Error,
    string
  >({
    mutationFn: (id) => blogApi.softDelete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      }),
  });

  // RESTORE BLOG
  const restoreBlog = useMutation<
    { message: string },
    Error,
    string
  >({
    mutationFn: (id) => blogApi.restore(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      }),
  });

  // HARD DELETE BLOG
  const hardDeleteBlog = useMutation<
    { message: string },
    Error,
    string
  >({
    mutationFn: (id) => blogApi.hardDelete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      }),
  });

  return {
    blogsQuery,
    createBlog,
    updateBlog,
    softDeleteBlog,
    restoreBlog,
    hardDeleteBlog,
  };
};