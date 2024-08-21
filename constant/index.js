import jwtDecode from "jwt-decode";
import mongoose from "mongoose";
export const TOKEN = "S3746DSGJDHCSDG";
export const ACCOUNT_LIST = "323DSDNBDS38_SDSKJ";
export const FEED_POST_DRAFT = "jug_dsd33";

export const setToken = (value) => {
  localStorage.setItem(TOKEN, value);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN);
};

export const deleteToken = () => {
  return localStorage.removeItem(TOKEN);
};

export const getUserAccounts = () => {
  const accounts = JSON.parse(localStorage.getItem(ACCOUNT_LIST)) || [];
  return accounts;
};

export const setUserAccount = (data) => {
  const accounts = JSON.parse(localStorage.getItem(ACCOUNT_LIST)) || [];
  if (!data) return accounts;
  const filteredAccount = accounts.filter((curr) => curr.id !== data.id);
  filteredAccount.push(data);
  localStorage.setItem(ACCOUNT_LIST, JSON.stringify(filteredAccount));
  return filteredAccount;
};

export const deleteUserAccount = (id) => {
  console.log(id);
  const accounts = JSON.parse(localStorage.getItem(ACCOUNT_LIST)) || [];
  if (!id) return accounts;
  const filter = accounts.filter((curr) => curr.id !== id);
  localStorage.setItem(ACCOUNT_LIST, JSON.stringify(filter));
  return filter;
};

export const isLoggedIn = () => {
  const token = getToken();
  if (!token) return false;
  const decoded = jwtDecode(token);
  const ObjectID = mongoose.Types.ObjectId;
  return ObjectID.isValid(decoded.id);
};
