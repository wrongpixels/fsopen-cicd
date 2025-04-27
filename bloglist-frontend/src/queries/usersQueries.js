import { useQuery } from "@tanstack/react-query";
import usersService from "../services/users.js";

export const useUsersQuery = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: usersService.getAll,
    retry: 2,
    refetchOnWindowFocus: false,
  });
