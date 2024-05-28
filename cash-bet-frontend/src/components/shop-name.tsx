import axios from "axios";
import React, { useEffect, useState } from "react";
import { AppUrl } from "./activities/app-url";

interface Props {
  shopId: number;
}

const ShopName: React.FC<Props> = ({ shopId }) => {
  const [shopeName, setShopName] = useState<string>("");

  useEffect(() => {
    axios
      .get(`${AppUrl()}/fetch-shop-name/${shopId}`)
      .then((res) => setShopName(res.data.shopName))
      .catch((error) => console.log(error));
  }, []);

  return <td>{shopeName}</td>;
};

export default ShopName;
