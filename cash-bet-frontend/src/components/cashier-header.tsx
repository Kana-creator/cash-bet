import React, { useState, useEffect } from "react";
import { MdSettings } from "react-icons/md";
import { UserLogOut } from "./activities/signout-action";
// import axios from "axios";
// import { AppUrl } from "./activities/app-url";
import { FormatMoney } from "./activities/format-money";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import { WithdrawModel } from "./modules/withdraw-model";
import { UserModule } from "./modules/user-module";
import { WithdrawBalance } from "./activities/withdraw-balance";
import { FormValidation } from "./activities/form-validation";

interface User {
  date_added: string;
  date_updated: string;
  duty_station: string;
  first_name: string;
  last_name: string;
  linked_to: number;
  login_status: number;
  user_email: string;
  user_id: number;
  user_password: string;
  user_role: string;
  user_telephone: string;
}

interface Props {
  managerCreditBalance: number;
  setManagerCreditBalance: React.Dispatch<React.SetStateAction<number>>;
}

const CashierHeader: React.FC<Props> = ({
  managerCreditBalance,
  // setManagerCreditBalance,
}) => {
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [dailyCashierReceipts, setDailyCashierReceipts] = useState<number>(0);
  const [chashierBalance, setCashierBalance] = useState<number>(0);
  const [isBalanceActive, setIsBalanceActive] = useState<boolean>(false);
  const [withdraw, setWithdraw] = useState<WithdrawModel>({
    cashier_id: "",
    amount: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user") as string;
    const current_user: User = JSON.parse(user);

    setCurrentUserName(current_user.first_name);
    setCurrentUserRole(current_user.user_role);
    setCurrentUserId(current_user.user_id);
  }, []);

  // FETCHING CASHIER DAILY RECEIPTS
  useEffect(() => {
    const user = localStorage.getItem("user") as string;
    const current_user: User = JSON.parse(user);
    const currentUserId = current_user.user_id;

    const interval = setInterval(() => {
      axios
        .get(`${AppUrl()}/fetch-cashier-daily-receipts/${currentUserId}`)
        .then((res) => setDailyCashierReceipts(res.data.receipts))
        .catch((error) => console.log(error));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // FETCHING CASHIER BALCNE
  useEffect(() => {
    const user = localStorage.getItem("user") as string;
    const current_user: User = JSON.parse(user);
    const user_id = current_user.user_id;

    const interval = setInterval(() => {
      axios.get(`${AppUrl()}/fetch-manager-balance/${user_id}`).then((res) => {
        if (res.data.status === "error") {
          window.alert(res.data.message);
        } else {
          setCashierBalance(res.data.manager_balance);
        }
      });
    }, 3000);
    return () => clearInterval(interval);
  });

  // SET CURRENT USER ID ON WITHDRAW
  useEffect(() => {
    const currentUser: UserModule = JSON.parse(
      localStorage.getItem("user") as string
    );

    setWithdraw({ ...withdraw, cashier_id: `${currentUser.user_id}` });
  }, []);

  return (
    <div className="bg-dark cashier-header position-fixed col-12 d-flex justify-content-center text-center">
      <div className="col-2 p-2 border border-light d-flex justify-content-center align-items-center">
        <h3>LOGO</h3>
      </div>
      <div className="col-3 p-2 border border-light d-flex justify-content-center align-items-center">
        <p>
          Credit balance:{" "}
          <span className="text-warning">
            {FormatMoney(managerCreditBalance, 2)}
          </span>
        </p>
      </div>
      <div
        className="col-3 p-2 border border-light d-flex justify-content-center align-items-center"
        style={{ cursor: "pointer" }}
        onClick={() => {
          setIsBalanceActive(true);
        }}
      >
        <p>
          Cashier balance:{" "}
          <span className="text-warning">
            {FormatMoney(chashierBalance, 2)}
          </span>
        </p>
      </div>
      <div className="col-2 p-2 border border-light d-flex justify-content-center align-items-center">
        <p className="col-6">
          Receipts: <span className="text-warning">{dailyCashierReceipts}</span>
        </p>
        {/* <p className="col-6">
          Time: <span className="text-warning">4hr</span>
        </p> */}
      </div>
      <div className="col-3 p-2 border border-light d-flex justify-content-center">
        <details className="position-relative  bg-dark px-3 py-1 col-6">
          <summary>
            <span>
              {currentUserName} {<MdSettings />}
            </span>
          </summary>
          {/* <p className="btn btn-secondary px-2 py-2 col-12 mt-3">Profile</p> */}
          <p
            className="btn btn-secondary px-2 py-2 col-12"
            onClick={() => UserLogOut(currentUserRole, currentUserId)}
          >
            Logout
          </p>
        </details>
      </div>

      <div
        className={`withdraw-form ${isBalanceActive ? "active" : ""}`}
        id="withdraw-form"
      >
        <form action="" onSubmit={(e) => e.preventDefault()}>
          <h1 className="col-12">Withdraw balance</h1>
          <h2 className="col-12">{FormatMoney(chashierBalance, 2)}</h2>
          <h3 className="pb-2 text-danger hidden bold">
            Insufficient balance.
          </h3>
          <div className="form-groupd col-12 py-3">
            <label htmlFor="amount" className="col-12 text-start">
              Amount {isBalanceActive}
            </label>
            <input
              type="number"
              id="amount"
              autoComplete="false"
              className="form-control"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setWithdraw({ ...withdraw, amount: e.target.value });
                FormValidation(e.target);
              }}
            />
            <small className="col-12"></small>
          </div>
          <div className="form-groupd col-12">
            <label htmlFor="email" className="col-12 text-start">
              Email / Telephone
            </label>
            <input
              type="text"
              id="email"
              autoComplete="false"
              className="form-control"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setWithdraw({ ...withdraw, email: e.target.value });
                FormValidation(e.target);
              }}
            />
            <small className="col-12"></small>
          </div>
          <div className="form-groupd col-12 py-2">
            <label htmlFor="password" className="col-12 text-start">
              Confirm with password
            </label>
            <input
              type="password"
              id="password"
              autoComplete="false"
              className="form-control"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setWithdraw({ ...withdraw, password: e.target.value });
                FormValidation(e.target);
              }}
            />
            <small className="col-12"></small>
          </div>
          <div className="form-groupd col-12 py-5 d-flex justify-content-around">
            <button
              type="button"
              className="col-4 btn btn-dark"
              onClick={() =>
                WithdrawBalance(withdraw, [
                  document.getElementById("amount") as HTMLInputElement,
                  document.getElementById("email") as HTMLInputElement,
                  document.getElementById("password") as HTMLInputElement,
                ])
              }
            >
              Submit
            </button>
            <button
              type="button"
              className="col-4 btn btn-secondary"
              onClick={() => {
                setIsBalanceActive(false);
                console.log(isBalanceActive);
              }}
            >
              Cancil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CashierHeader;
