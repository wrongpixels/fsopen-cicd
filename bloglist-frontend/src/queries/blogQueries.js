import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs.js'

export const useGetBlogs = () =>
  useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    retry: 2,
    refetchOnWindowFocus: false,
  })

const getBlogs = async () => {
  const targetBlogs = await blogService.getAll()
  return orderBlogs(targetBlogs)
}

export const orderBlogs = (targetBlogs) =>
  [...targetBlogs].sort((a, b) => b.likes - a.likes)

export const useCreateBlog = (queryClient) => {
  return useMutation({
    mutationKey: 'blogs',
    mutationFn: blogService.addBlog,
    onSuccess: (newBlog) =>
      queryClient.setQueryData(
        ['blogs'],
        queryClient.getQueryData(['blogs']).concat(newBlog)
      ),
  })
}

const editBlog = (queryClient, edited) =>
  queryClient.setQueryData(
    ['blogs'],
    orderBlogs(
      queryClient
        .getQueryData(['blogs'])
        .map((b) => (b.id === edited.id ? edited : b))
    )
  )

export const useAddComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['blogs'],
    mutationFn: blogService.addComment,
    onSuccess: (edited) => editBlog(queryClient, edited),
  })
}

export const useReplaceBlog = (queryClient) => {
  return useMutation({
    mutationKey: 'blogs',
    mutationFn: blogService.replaceBlogData,
    onSuccess: (edited) => editBlog(queryClient, edited),
  })
}

export const useDeleteBlog = (queryClient) => {
  return useMutation({
    mutationKey: 'blogs',
    mutationFn: blogService.deleteBlog,
    onSuccess: (id) =>
      queryClient.setQueryData(
        ['blogs'],
        queryClient.getQueryData(['blogs']).filter((b) => b.id !== id)
      ),
  })
}
