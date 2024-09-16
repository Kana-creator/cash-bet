import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdSettings } from "react-icons/md";
import { UserLogOut } from "./activities/signout-action";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import { ReceiptModule } from "./modules/receipt-module";
import { FormatMoney } from "./activities/format-money";
import { UserModule } from "./modules/user-module";
import ReceiptRow from "./receipt-row";
import CreditRow from "./credit-row";
import { CreditModel } from "./modules/credit-model";

interface Props {
  currentUserId: number;
  currentUserName: string;
  currentUserRole: string;
}

const CreditTable: React.FC<Props> = ({
  currentUserId,
  currentUserName,
  currentUserRole,
}) => {
  const [credit, setCredit] = useState<CreditModel[]>([]);
  const [filteredCredit, setFilteredCredit] = useState<CreditModel[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  let componentRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // FETCH CASHIERS AND SHOPS
  useEffect(() => {
    const user: UserModule = JSON.parse(localStorage.getItem("user") as string);
    const user_id = user.user_id;

    axios
      .get(`${AppUrl()}/fetch-credit/${user_id}`)
      .then((res) => {
        if (res.data.status && res.data.status !== "OK") {
          window.alert(res.data.message);
        } else {
          setCredit(res.data.credit);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // find the sun of all pus credit values
  const handleAddPlusValues = (): number => {
    return filteredCredit.reduce(
      (total, crdt) =>
        crdt.credit_type === "plus"
          ? Number(total) + Number(crdt.credit_amount)
          : total,
      0
    );
  };

  // find the sum of all minus credit values
  const handleAddMinusValues = (): number => {
    return filteredCredit.reduce(
      (total, crdt) =>
        crdt.credit_type === "minus"
          ? Number(total) + Number(crdt.credit_amount)
          : total,
      0
    );
  };

  // handle search for credit
  useEffect(() => {
    const originalCredit = credit;

    if (searchString.trim().length < 1) {
      setFilteredCredit(originalCredit);
    } else {
      setFilteredCredit(
        originalCredit.filter((credit) => {
          const creditDate = new Date(credit.transaction_date).getDate();
          const creditMonth = new Date(credit.transaction_date).getMonth() + 1;
          const creditYear = new Date(credit.transaction_date).getFullYear();

          const date = creditDate + "/" + creditMonth + "/" + creditYear;

          return (
            Number(credit.credit_amount) === Number(searchString) ||
            credit.credit_type.includes(searchString) ||
            date.includes(searchString) ||
            credit.first_name.includes(searchString) ||
            Number(credit.user_id) === Number(searchString) ||
            credit.last_name.includes(searchString)
          );
        })
      );
    }
  }, [searchString, credit]);

  // handle change search
  const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  return (
    <div className=" col-12 d-flex flex-wrap justify-content-center">
      <div className="page-heading col-10 d-flex justify-content-around mb-4 p-4">
        <h4 className="fs-4">Credit Transactions</h4>

        <input
          type="text"
          name="filterCredit"
          id="filterCredit"
          placeholder="Search"
          className="col-4"
          onChange={changeSearch}
        />

        <div
          className="days col-2 d-flex justify-content-between align-items-center"
          style={{ maxHeight: "30px" }}
        >
          <button className="btn btn-info" onClick={handlePrint}>
            Print reports
          </button>
        </div>

        <details
          className="position-relative  bg-dark px-3 py-1"
          style={{ width: "fit-content" }}
        >
          <summary>
            <span>
              {currentUserName} {<MdSettings />}
            </span>
          </summary>
          {/* <p className="btn btn-secondary px-2 py-2 col-12 mt-3">Profile</p> */}
          <p
            className="btn btn-secondary px-2 py-2 col-12 mt-4"
            onClick={() => UserLogOut(currentUserRole, currentUserId)}
          >
            Logout
          </p>
        </details>
      </div>
      <div
        ref={componentRef}
        className="text-center pt-5 pb-3 mt-5 col-12 d-flex flex-wrap justify-content-center overflow-x-auto px-3  "
      >
        <table className="receipt-table my-5 col-8">
          <thead>
            <tr>
              <th>No</th>
              <th>Giver</th>
              <th>User ID</th>
              <th>First name</th>
              <th>Last name</th>
              <th>User telephone</th>
              <th>User role</th>
              <th>Amount</th>
              <th>Transaction type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredCredit.map((crdt, index) => {
              return (
                <CreditRow key={index} creditIndex={index} credit={crdt} />
              );
            })}
            <tr>
              <td colSpan={10}></td>
            </tr>
            <tr>
              <td colSpan={5} rowSpan={4} className="fs-5">
                TOTALS
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="fs-6">
                Total plus
              </td>
              <td colSpan={2} className="fs-6">
                {FormatMoney(handleAddPlusValues(), 2)}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="fs-6">
                Total minus
              </td>
              <td colSpan={2} className="fs-6">
                {FormatMoney(handleAddMinusValues(), 2)}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="fs-6">
                Net total
              </td>
              <td colSpan={2} className="fs-6">
                {FormatMoney(handleAddPlusValues() - handleAddMinusValues(), 2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreditTable;
