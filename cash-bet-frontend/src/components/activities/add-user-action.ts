import { AxiosStatic } from "axios";
import {
  FormValidation,
  emailValidation,
  comparePasswords,
} from "./form-validation";
import { AppUrl } from "./app-url";
import { UserModule } from "../modules/user-module";
export const Adduser = (
  inputArray: [
    userCategory: HTMLInputElement,
    dutyStation: HTMLInputElement,
    firstName: HTMLInputElement,
    lastName: HTMLInputElement,
    userEmail: HTMLInputElement,
    phoneNumber: HTMLInputElement,
    userPassword: HTMLInputElement,
    confirmPassword: HTMLInputElement
  ],

  axios: AxiosStatic,
  userData: UserModule,
  setShowUserForm: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]{2,4}$/;
  const validEmail = pattern.test(inputArray[4].value);
  if (inputArray[4].value.trim().length !== 0 && !validEmail) {
    emailValidation(inputArray[4]);
  } else if (
    inputArray[0].value.trim().length < 1 ||
    inputArray[1].value.trim().length < 1 ||
    inputArray[2].value.trim().length < 1 ||
    inputArray[5].value.trim().length < 1 ||
    inputArray[6].value.trim().length < 1 ||
    inputArray[7].value.trim().length < 1
  ) {
    inputArray.forEach((input) => {
      FormValidation(input);
    });
  } else if (inputArray[6].value !== inputArray[7].value) {
    comparePasswords(inputArray[7]);
  } else {
    axios
      .post(`${AppUrl()}/addUser`, userData, {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((res) => {
        window.alert(res.data.message);
        if (res.data.status === "success") {
          setShowUserForm(false);
        }
      })
      .catch((error) => console.log(error));
  }
};
