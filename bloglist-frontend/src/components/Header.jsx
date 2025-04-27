import { useRef } from "react";
import { useUsersQuery } from "../queries/usersQueries.js";
import { Link, useNavigate } from "react-router-dom";
import { Button, Navbar, Nav } from "react-bootstrap";
import styles from "./styles/componentStyles.js";
import LoginForm from "./LoginForm.jsx";
import Notification from "./Notification.jsx";
import useNotification from "../hooks/useNotification.js";
import useActiveUser from "../hooks/useActiveUser.js";

const Header = ({ user }) => {
  const { isLoading, isError, data } = useUsersQuery();
  if (user && data) {
    user.id = data.find(
      (u) => u.username === user.username && u.name === user.name,
    )?.id;
  }
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { resetUserData, setUserData } = useActiveUser();

  const loginFormRef = useRef();

  const resetSession = () => {
    showNotification(`See you soon, ${user.name}!`);
    loginFormRef.current?.cleanForm();
    resetUserData();
  };

  const setSession = (userData) => {
    setUserData(userData);
    navigate("/");
    showNotification(`Welcome back, ${userData.name}!`);
  };

  const linkStyle = {
    paddingRight: "15px",
    fontStyle: "none",
    textDecoration: "none",
    color: "#e1e1e1",
  };
  const userStyle = {
    paddingRight: "5px",
    paddingLeft: "5px",
    fontStyle: "none",
    textDecoration: "underline",
    color: "#e1e1e1",
  };
  const loggedStyle = {
    paddingRight: "20px",
    paddingTop: "4px",
    color: "#abd1e6",
  };

  return (
    <div className="mb-3">
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        className="ps-5 pe-5 shadow-sm"
      >
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" as="span">
              <Link style={linkStyle} to="/">
                <b>Blogs</b>
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={linkStyle} to="/users">
                <b>Users</b>
              </Link>
            </Nav.Link>
          </Nav>
          <Nav>
            {user && (
              <>
                <span style={loggedStyle}>
                  Logged in as{" "}
                  <b>
                    {user.id && (
                      <Link to={`/users/${user.id}`} style={userStyle}>
                        {user.username}
                      </Link>
                    )}
                  </b>
                </span>
                <Button
                  variant="danger"
                  onClick={resetSession}
                  {...styles.fixedButton}
                >
                  Log out
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Notification />
      {!user && (
        <div className="container w-25">
          <LoginForm setSession={setSession} ref={loginFormRef} />
        </div>
      )}
    </div>
  );
};

export default Header;
