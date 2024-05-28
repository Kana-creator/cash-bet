import { AppUrl } from "./app-url";
import { FormValidation } from "./form-validation";
import axios from "axios";

const routing = (user_role: string) => {
  let url: string = "";
  if (user_role === "Admin") {
    return (url = "/admin-dashboard");
  } else if (user_role === "partner" || user_role === "internal partner") {
    return (url = "/partner-dashboard");
  } else if (user_role === "cashier") {
    return (url = "/cashier-page");
  } else if (user_role === "manager") {
    return (url = "/manager-page");
  } else if (user_role === "Operator") {
    return (url = "/operator-page");
  } else if (user_role === "accountant") {
    return (url = "/admin-reports");
  } else if (user_role === "sales") {
    return (url = "/sales-page");
  } else if (user_role === "supervisor") {
    return (url = "/admin-reports");
  } else if (user_role === "other admin") {
    return (url = "/admin-reports");
  }
};

export const SigninAction = (
  inputArray: [username: HTMLInputElement, password: HTMLInputElement],
  userData: { userName: string; userPassword: string },
  url: string
) => {
  if (
    inputArray[0].value.trim().length < 1 ||
    inputArray[1].value.trim().length < 1
  ) {
    inputArray.forEach((input) => {
      FormValidation(input);
    });
  } else {
    axios
      .post(`${AppUrl()}/userLogin`, userData, {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((res) => {
        // console.log(res.data.message);
        if (res.data.status === "success") {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          window.location.href = "" + routing(res.data.user.user_role);
        } else {
          window.alert(res.data.message);
        }
      })
      .catch((error) => console.log(error));
  }
};
