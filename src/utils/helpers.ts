import jwt_decode from "jwt-decode";
import { NavigateFunction } from "react-router-dom";

export const WEB_SOCKET_URL = "ws://100.20.75.116/";
export const ACCESS_TOKEN = "access-token";
export const REFRESH_TOKEN = "refresh-token";
export const USER = "user";

const getAuthorizationToken = () => localStorage.getItem(ACCESS_TOKEN);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN);
const getUser = () => localStorage.getItem(USER);

const setAuthorizationToken = (token: string) =>
  localStorage.setItem(ACCESS_TOKEN, token);
const setRefreshToken = (token: string) =>
  localStorage.setItem(REFRESH_TOKEN, token);
const setUser = (user: string) => localStorage.setItem(USER, user);

const removeAuthToken = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
};

const logout = (navigate: NavigateFunction) => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  navigate("/");
};
const isLogin = () => {
  if (getAuthorizationToken()) {
    try {
      const { exp } = jwt_decode(getAuthorizationToken() as string) as {
        exp: number;
      };
      const now = new Date().getTime() / 1000; // Date().getTime() returns milliseconds.
      // So divide by 1000 to get seconds
      if (now > exp) {
        // user profile has expired.
        return false;
      } else {
        return true;
      }
    } catch {
      return false;
    }
  } else {
    return false;
  }
};

const getHeaderConfig = () => ({
  headers: {
    Authorization: `Bearer ${getAuthorizationToken()}`,
  },
});

const convertToFormData = (data: any) => {
  const formdata = new FormData();
  if (data) {
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[`${key}`])) {
        data[`${key}`].forEach((v: any) => {
          if (typeof v === "object") {
            Object.keys(v).forEach((tempKey) => {
              formdata.append(`${key}[${tempKey}]`, v[`${tempKey}`]);
            });
          } else {
            formdata.append(`${key}[]`, v);
          }
        });
      } else if (data[`${key}`]) {
        formdata.append(key, data[`${key}`]);
      }
    });
  }
  return formdata;
};

export const helperUtils = {
  getAuthorizationToken,
  getRefreshToken,
  getUser,
  setAuthorizationToken,
  setRefreshToken,
  setUser,
  getHeaderConfig,
  removeAuthToken,
  logout,
  isLogin,
  convertToFormData,
};
