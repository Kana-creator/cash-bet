import { AxiosStatic } from "axios";
import {
  FormValidation,
  emailValidation,
  comparePasswords,
} from "./form-validation";
import { AppUrl } from "./app-url";
import { UserModule } from "../modules/user-module";
export const AddAdminUser = (
  inputArray: [
    userCategory: HTMLInputElement,
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
  const validEmail = pattern.test(inputArray[3].value);
  if (inputArray[3].value.trim().length !== 0 && !validEmail) {
    emailValidation(inputArray[3]);
  } else if (
    inputArray[0].value.trim().length < 1 ||
    inputArray[1].value.trim().length < 1 ||
    inputArray[2].value.trim().length < 1 ||
    inputArray[5].value.trim().length < 1 ||
    inputArray[6].value.trim().length < 1
  ) {
    inputArray.forEach((input) => {
      FormValidation(input);
    });
  } else if (inputArray[5].value !== inputArray[6].value) {
    comparePasswords(inputArray[6]);
  } else {
    axios
      .post(`${AppUrl()}/addUser`, userData, {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((res) => {
        console.log(res.data.message);
        window.alert(res.data.message);
        setShowUserForm(false);
      })
      .catch((error) => console.log(error));
  }
};
