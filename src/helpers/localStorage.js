export const getTheData = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const noUser = JSON.parse(localStorage.getItem("noUser"));

  if (user) return user;
  if (noUser) return noUser;
  else return false;
};

export const setTheData = (any, data) => {
  localStorage.setItem(any, JSON.stringify(data));
};
