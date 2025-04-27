import axios from "axios";
const baseUrl = "/api/blogs";

let activeToken = {};

const buildToken = (token) =>
  (activeToken = { authorization: `Bearer ${token}` });

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};
const replaceBlogData = async (data) => {
  const response = await axios.put(`${baseUrl}/${data.id}`, data);
  return response.data;
};

const addBlog = async (blog) => {
  if (
    !activeToken ||
    !activeToken.authorization ||
    activeToken.authorization === "Bearer "
  ) {
    return { error: "Expired token" };
  }
  const addedBlog = await axios.post(baseUrl, blog, { headers: activeToken });
  return addedBlog.data;
};

const addComment = async ({ comment, blog }) => {
  if (
    !activeToken ||
    !activeToken.authorization ||
    activeToken.authorization === "Bearer "
  ) {
    return { error: "Expired token" };
  }
  const response = await axios.post(
    `${baseUrl}/${blog.id}/comments`,
    { comment },
    {
      headers: activeToken,
    },
  );
  return response.data;
};

const deleteBlog = async (blog) => {
  const response = await axios.delete(`${baseUrl}/${blog.id}`, {
    headers: activeToken,
  });
  return blog.id;
};

export default {
  getAll,
  addBlog,
  replaceBlogData,
  deleteBlog,
  buildToken,
  addComment,
};
