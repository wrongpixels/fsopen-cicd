import { useQueryClient } from "@tanstack/react-query";

import {
  useCreateBlog,
  useDeleteBlog,
  useReplaceBlog,
  useGetBlogs,
} from "../queries/blogQueries.js";

export const useBlogs = () => {
  const queryClient = useQueryClient();
  const blogsQuery = useGetBlogs();
  const createBlogMutation = useCreateBlog(queryClient);
  return {
    blogsQuery,
    createBlogMutation,
  };
};

export const useBlog = () => {
  const queryClient = useQueryClient();
  const blogsQuery = useGetBlogs();
  const deleteBlogMutation = useDeleteBlog(queryClient);
  const replaceBlogMutation = useReplaceBlog(queryClient);
  return {
    blogsQuery,
    deleteBlogMutation,
    replaceBlogMutation,
  };
};
