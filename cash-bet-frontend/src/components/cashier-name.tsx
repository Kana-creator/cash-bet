import axios from "axios";
import React, { useEffect, useState } from "react";
import { AppUrl } from "./activities/app-url";

interface Props {
  cashierId: number;
}

const CashierName: React.FC<Props> = ({ cashierId }) => {
  const [cashierName, setCashierName] = useState<string>("");

  useEffect(() => {
    axios
      .get(`${AppUrl()}/fetch-cashier-name/${cashierId}`)
      .then((res) => setCashierName(res.data.cashierName))
      .catch((error) => console.log(error));
  }, []);

  return <td>{cashierName}</td>;
};

export default CashierName;
