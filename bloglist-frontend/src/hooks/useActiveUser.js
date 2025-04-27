import { useEffect } from "react";
import blogService from "../services/blogs.js";

import {
  setUser,
  resetUser,
  restoreUser,
} from "../actions/activeUserActions.js";
import { useActiveUserContext } from "../context/ActiveUserContext.jsx";

const useActiveUser = () => {
  const [activeUser, dispatchUser] = useActiveUserContext();

  const setUserData = (userData) => dispatchUser(setUser(userData));
  const resetUserData = () => dispatchUser(resetUser);
  const restoreUserData = () => {
    if (!activeUser) {
      dispatchUser(restoreUser);
    }
  };

  useEffect(() => {
    if (activeUser) {
      blogService.buildToken(activeUser.token);
    } else {
      blogService.buildToken("");
    }
  }, [activeUser]);

  return { activeUser, setUserData, resetUserData, restoreUserData };
};
export default useActiveUser;
