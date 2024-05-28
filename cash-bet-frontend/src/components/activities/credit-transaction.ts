import axios from "axios";
import { AppUrl } from "./app-url";
import { Credit } from "../modules/credit-module";

export const Transact = (
  data: Credit,
  setCredit: React.Dispatch<React.SetStateAction<Credit>>,
  setCreditStatus: React.Dispatch<React.SetStateAction<boolean>>,
  token: string,
  credit_field: HTMLInputElement,
  user_id: number,
  user_role: string
) => {
  const parent = credit_field.parentElement as HTMLElement;
  const small = parent.querySelector("small") as HTMLElement;

  if (credit_field.value === "" || credit_field.value === "0") {
    small.innerText = "Please fill in the credit amount.";
  } else {
    small.innerText = "";
    axios
      .post(`${AppUrl()}/credit-transaction/${user_id}/${user_role}`, data, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.data.status === "success") {
          setCreditStatus(false);
          setCredit({
            given_by: 0,
            given_to: 0,
            credit_amount: 0,
            credit_type: "",
            user_name: "",
            shop_manager: 0,
            user_role: "",
          });
          credit_field.value = "";
          small.innerText = "";
        }
        window.alert(res.data.message);
      })
      .catch((error) => console.log(error));
  }
};
