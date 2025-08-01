// utils/auth.js
import Cookies from "js-cookie";

export const setAuth = (token, user) => {
  Cookies.set("jwt_token", token, { expires: 7 });
  Cookies.set("user_role", user.role, { expires: 7 });
};

export const removeAuth = () => {
  Cookies.remove("jwt_token");
  Cookies.remove("user_role");
};

export const getToken = () => {
  return Cookies.get("jwt_token");
};

export const getUserRole = () => {
  return Cookies.get("user_role");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const isAdmin = () => {
  return getUserRole() === "ADMIN";
};
