import ReactDOM from "react-dom/client";
import App from "./App";
import { NotificationContextProvider } from "./context/NotificationContext.jsx";
import { UserLoginContextProvider } from "./context/ActiveUserContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <UserLoginContextProvider>
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </UserLoginContextProvider>
  </QueryClientProvider>,
);
