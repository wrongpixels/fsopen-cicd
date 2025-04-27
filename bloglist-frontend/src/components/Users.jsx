import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import styles from "./styles/componentStyles.js";
import useNotification from "../hooks/useNotification.js";
import { useUsersQuery } from "../queries/usersQueries.js";

const Users = ({ user }) => {
  const { showError } = useNotification();
  const { isLoading, isError, data } = useUsersQuery();
  if (!user) {
    return null;
  }
  if (isError) {
    return <h3>Couldn't load user data.</h3>;
  }
  if (isLoading) {
    return <h3>Loading…</h3>;
  }

  const users = data;

  return (
    <div>
      <h1>
        <b>Users</b>
      </h1>
      <div {...styles.bubble}>
        <Table>
          <thead>
            <tr>
              <th className="bg-transparent">
                <h4>
                  <b>Name:</b>
                </h4>
              </th>
              <th className="bg-transparent">
                <h4>
                  <b>Blogs created:</b>
                </h4>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="bg-transparent">
                  <b>
                    <Link {...styles.link} to={`/users/${u.id}`}>
                      {" "}
                      {u.name}{" "}
                    </Link>
                  </b>
                </td>
                <td className="bg-transparent">{u.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
export default Users;
