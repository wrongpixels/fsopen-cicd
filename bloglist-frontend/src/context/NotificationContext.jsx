import { createContext, useReducer, useContext } from "react";

const NotificationContext = createContext();

const initialState = { message: "", error: true };

const notificationReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case "NOTIFICATION_SET":
      return payload;
    case "NOTIFICATION_RESET":
      return initialState;
    default:
      return state;
  }
};
export const useNotificationValue = () => useContext(NotificationContext)[0];
export const useNotificationDispatch = () => useContext(NotificationContext)[1];

export const NotificationContextProvider = ({ children }) => {
  const providerValues = useReducer(notificationReducer, initialState);
  return (
    <NotificationContext.Provider value={providerValues}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
