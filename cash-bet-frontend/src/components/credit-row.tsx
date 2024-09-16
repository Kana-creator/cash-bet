import React from "react";
import { CreditModel } from "./modules/credit-model";

interface Props {
  credit: CreditModel;
  creditIndex: number;
}

const CreditRow: React.FC<Props> = ({ credit, creditIndex }) => {
  return (
    <tr>
      <td>{creditIndex + 1}</td>
      <td>{credit.given_by}</td>
      <td>{credit.given_to}</td>
      <td>{credit.first_name}</td>
      <td>{credit.last_name}</td>
      <td>{credit.user_telephone}</td>
      <td>{credit.user_role}</td>
      <td>{credit.credit_amount}</td>
      <td>{credit.credit_type}</td>
      <td>{new Date(credit.transaction_date).toUTCString()}</td>
    </tr>
  );
};

export default CreditRow;
