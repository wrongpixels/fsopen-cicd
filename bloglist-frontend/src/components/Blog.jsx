import PropTypes from "prop-types";
import { Table, Button } from "react-bootstrap";
import styles from "./styles/componentStyles.js";
import BlogComments from "./BlogComments.jsx";
import useNotification from "../hooks/useNotification.js";
import { useBlog } from "../hooks/useBlogs.js";
import { useQueryClient } from "@tanstack/react-query";
import { useMatch, useNavigate, Link } from "react-router-dom";

const Blog = ({ user }) => {
  const { showError, showNotification } = useNotification();
  const { blogsQuery, deleteBlogMutation, replaceBlogMutation } = useBlog();
  const { isLoading, isError, data } = blogsQuery;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const cachedBlogs = queryClient.getQueryData(["blogs"]);

  const match = useMatch("/blogs/:id");
  const blogs = cachedBlogs ? cachedBlogs : isError || isLoading ? null : data;
  if (!user) {
    return null;
  }
  if (!blogs) {
    if (isLoading) {
      return <h3>Loading...</h3>;
    }
    if (isError) {
      return <h3>Error loading blogs data.</h3>;
    }
  }
  if (!blogs) {
    return <div>No blogs data available.</div>;
  }

  const targetBlog = blogs.find((b) => b.id === match?.params.id);
  if (!targetBlog) {
    return <div>Blog data not found in server.</div>;
  }

  const deleteBlog = () => {
    deleteBlogMutation.mutate(targetBlog, {
      onSuccess: () => {
        showNotification(`Blog '${targetBlog.title}' was deleted!`);
        navigate("/");
      },
      onError: () => showError("There was an error deleting the blog"),
    });
  };

  const addLike = () => {
    replaceBlogMutation.mutate(
      { id: targetBlog.id, likes: targetBlog.likes + 1 },
      {
        onSuccess: () =>
          showNotification(`Blog '${targetBlog.title}' was liked!`),
        onError: () => showError("There was an error adding the like"),
      },
    );
  };
  const blogSectionStyle = {
    paddingTop: 10,
    paddingLeft: 10,
    marginRight: 20,
    paddingBottom: 10,
    border: "solid",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
  };
  const buttonStyle = {
    paddingTop: 5,
    paddingBottom: 7,
  };

  const handleDeleteBlog = async () => {
    if (
      window.confirm(
        `Delete blog '${targetBlog.title}' by ${targetBlog.author}?\n\nThis action is permanent.`,
      )
    ) {
      deleteBlog();
    }
  };
  const deleteButton = () => {
    if (!targetBlog.user) {
      return;
    }
    if (targetBlog.user.username === user?.username) {
      return (
        <div style={buttonStyle}>
          <Button
            onClick={handleDeleteBlog}
            variant="danger"
            {...styles.fixedButton}
          >
            Remove
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="blog-entry">
      <h1>
        <b>Blogs</b>
      </h1>
      <h3>
        <b>{targetBlog.title}</b> <i>{`(by ${targetBlog.author})`}</i>
      </h3>
      <div {...styles.bubble}>
        <div className="mt-2 pb-2">
          <h4>
            <b>Blog info:</b>
          </h4>
        </div>
        <div {...styles.tall}>
          <b>URL: </b>
          <a href={targetBlog.url} {...styles.link}>
            {targetBlog.url}
          </a>
          <br />
        </div>
        <b>Likes:</b> <span className="blog-likes">{targetBlog.likes}</span>
        <span className="ms-2">
          <Button
            variant="success"
            onClick={addLike}
            size="sm"
            {...styles.fixedButton}
          >
            Like!
          </Button>
        </span>
        <br />
        <div {...styles.tall}>
          <b>Added by: </b>
          {targetBlog.user?.username ? (
            <Link {...styles.link} to={`/users/${targetBlog.user.id}`}>
              {targetBlog.user.username}
            </Link>
          ) : (
            "?"
          )}
        </div>
        {deleteButton()}
      </div>
      <BlogComments targetBlog={targetBlog} />
      <Button
        onClick={() => navigate("/")}
        variant="outline-secondary"
        {...styles.fixedButton}
      >
        Go back
      </Button>
    </div>
  );
};

Blog.propTypes = {
  user: PropTypes.object,
};

export default Blog;
