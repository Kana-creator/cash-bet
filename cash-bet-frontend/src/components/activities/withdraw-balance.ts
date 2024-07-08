import axios from "axios";
import { WithdrawModel } from "../modules/withdraw-model";
import { FormValidation } from "./form-validation";
import { AppUrl } from "./app-url";

export const WithdrawBalance = (
  withdraw: WithdrawModel,
  inputArray: [
    amount: HTMLInputElement,
    email: HTMLInputElement,
    password: HTMLInputElement
  ]
) => {
  if (
    inputArray[0].value.trim().length < 1 ||
    inputArray[1].value.trim().length < 1 ||
    inputArray[2].value.trim().length < 1
  ) {
    inputArray.forEach((input) => {
      if (input.value.trim().length < 1) {
        FormValidation(input);
      }
    });
  } else {
    axios
      .post(`${AppUrl()}/withdraw-balance`, withdraw)
      .then((res) => {
        window.alert(res.data.message);
      })
      .catch((error) => console.log(error));
  }
};
