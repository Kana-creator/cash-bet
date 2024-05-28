import axios from "axios";
import { AppUrl } from "./app-url";
import { ShopModule } from "../modules/shop-module";
import { FormValidation } from "./form-validation";

export const AddShopAction = (
  inputArray: [
    shopName: HTMLInputElement,
    shopLocation: HTMLInputElement,
    minimumStake: HTMLInputElement,
    maximumStake: HTMLInputElement,
    maximumPayout: HTMLInputElement
  ],
  shopData: ShopModule,
  token: string,
  setShowShopForm: React.Dispatch<React.SetStateAction<boolean>>,
  user_id: number
) => {
  if (
    inputArray[0].value.trim().length < 1 ||
    inputArray[1].value.trim().length < 1 ||
    inputArray[2].value.trim().length < 1 ||
    inputArray[3].value.trim().length < 1 ||
    inputArray[4].value.trim().length < 1
  ) {
    inputArray.forEach((input) => {
      FormValidation(input);
    });
  } else {
    axios
      .post(`${AppUrl()}/addShop/${user_id}`, shopData, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.data.status === "error") {
          window.alert(res.data.message);
        } else {
          setShowShopForm(false);
          window.alert(res.data.message);
        }
      })
      .catch((error) => console.log(error));
  }
};
