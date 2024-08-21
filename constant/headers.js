import { getToken } from "@constant";

export const getAuthHeader = () => {
  return {
    headers: {
      authorization: `Bearer ${getToken()}`,
    },
  };
};
