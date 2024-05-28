import { AxiosStatic } from "axios";
import { FormValidation } from "./form-validation";
import { AppUrl } from "./app-url";
import { UserModule } from "../modules/user-module";
export const AdminSignupAction = (
  e: React.FormEvent,
  inputArray: [
    firstName: HTMLInputElement,
    lastName: HTMLInputElement,
    email: HTMLInputElement,
    phoneNumber: HTMLInputElement,
    password: HTMLInputElement,
    confirmPassword: HTMLInputElement
  ],
  axios: AxiosStatic,
  data: UserModule
) => {
  e.preventDefault();

  if (
    inputArray[0].value.trim().length < 1 ||
    inputArray[1].value.trim().length < 1 ||
    inputArray[2].value.trim().length < 1 ||
    inputArray[3].value.trim().length < 1 ||
    inputArray[4].value.trim().length < 1 ||
    inputArray[5].value.trim().length < 1
  ) {
    inputArray.forEach((input) => {
      FormValidation(input);
    });
  } else {
    axios
      .post(`${AppUrl()}/adminSignup`, data)
      .then((res) => {
        window.alert(res.data.message);
        window.location.href = "/admin";
      })
      .catch((error) => console.log(error));
  }
};
