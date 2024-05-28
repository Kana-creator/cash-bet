import axios from "axios";
import { AppUrl } from "./app-url";

const routing = (user_role: string) => {
  localStorage.clear();

  let url: string;

  if (user_role === "Admin") {
    return (url = "/admin");
  } else {
    return (url = "/");
  }
};

export const UserLogOut = (user_role: string, user_id: number) => {
  axios
    .post(`${AppUrl()}/log-out`, { user_id })
    .then((res) =>
      res.data.status === "success"
        ? (window.location.href = routing(user_role))
        : console.log(res.data.message)
    )
    .catch((error) => console.log(error));
};
