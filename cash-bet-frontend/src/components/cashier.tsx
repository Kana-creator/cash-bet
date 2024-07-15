import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { Credit } from "./modules/credit-module";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import { FormatMoney } from "./activities/format-money";
import { FormValidation } from "./activities/form-validation";
import { WithdrawBalance } from "./activities/withdraw-balance";
import { WithdrawModel } from "./modules/withdraw-model";
import { UserModule } from "./modules/user-module";

interface Props {
  userData: {
    block_status: number;
    date_added: string;
    date_updated: string;
    duty_station: string;
    first_name: string;
    last_name: string;
    linked_to: number;
    login_status: number;
    max_payout: number;
    max_stake: number;
    min_stake: number;
    operator: number;
    sales_limit: number;
    shop_id: number;
    shop_location: string;
    shop_name: string;
    user_email: string;
    user_id: number;
    user_password: string;
    user_role: string;
    user_telephone: string;
  };

  setShowUserForm: React.Dispatch<React.SetStateAction<boolean>>;
  setCreditStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setCredit: React.Dispatch<React.SetStateAction<Credit>>;
  credit: Credit;
  userToken: string;
  currentUserId: number;
}

const Cashier: React.FC<Props> = ({
  userData,
  // setShowUserForm,
  setCreditStatus,
  setCredit,
  credit,
  userToken,
  currentUserId,
}) => {
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [userSession, setUserSession] = useState<number>(0);
  const [chashierBalance, setCashierBalance] = useState<number>(0);
  const [isBalanceActive, setIsBalanceActive] = useState<boolean>(false);
  const [withdraw, setWithdraw] = useState<WithdrawModel>({
    cashier_id: "",
    amount: "",
    email: "",
    password: "",
  });
  const [balanceMessage, setBalanceMessage] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get(`${AppUrl()}/fetch-credit-balance/${userData.user_id}`, {
          headers: { "x-access-token": userToken },
        })
        .then((res) => {
          if (res.data.status === "success") {
            setCreditBalance(res.data.credit_balance.available_credit);
          } else {
            window.alert(res.data.message);
          }
        })
        .catch((error) => console.log(error));
    }, 3000);

    axios
      .get(`${AppUrl()}/fetch-single-user-session/${userData.user_id}`)
      .then((res) => setUserSession(res.data.session))
      .catch((error) => console.log(error));

    return () => clearInterval(interval);
  }, [userData.user_id, userToken]);

  // SARTING CASHIER'S SESSION
  const startSession = (user_id: number) => {
    axios
      .get(`${AppUrl()}/start-session/${user_id}`, {
        headers: { "x-access-token": userToken },
      })
      .then((res) => {
        window.alert(res.data.message);
        if (res.data.status === "success") {
          setUserSession(1);
        }
      })
      .catch((error) => console.log(error));
  };

  // ENDIND CASHIER'S SESSION
  const endSession = (user_id: number) => {
    axios
      .get(`${AppUrl()}/end-session/${user_id}`, {
        headers: { "x-access-token": userToken },
      })
      .then((res) => {
        window.alert(res.data.message);
        if (res.data.status === "success") {
          setUserSession(0);
        }
      })
      .catch((error) => console.log(error));
  };

  // FETCHING CASHIER BALANCE
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get(`${AppUrl()}/fetch-manager-balance/${userData.user_id}`)
        .then((res) => {
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
  }, [withdraw]);

  return (
    <div className="user col-md-11 p-1 my-1">
      <div className="user-first-inner col-12 d-flex flex-wrap align-itmes-center">
        <div className="d-flex col-12 align-items-center user-name">
          <h4 className="">
            {"200" +
              userData.user_id +
              " " +
              userData.first_name +
              " " +
              userData.last_name}
          </h4>
          <sup
            className={`login-status ${
              userData.login_status === 1 ? "active" : "not-active"
            }`}
          ></sup>
        </div>
        <div className="col-12 d-flex flex-wrap align-items-center">
          <FaUser className=" px-2 user-icon" />
          <div className="col-11 pl-3 d-flex justify-content-between">
            <div className="col-12 d-flex align-items-center justify-content-around">
              <div className="col-6 d-flex flex-wrap">
                <span className="col-12">
                  <strong>Role: </strong>
                  <span className="text-warning">{userData.user_role}</span>
                </span>
                <span className="col-12">
                  <strong>Duty station: </strong>

                  <span className="text-warning">
                    {"100" +
                      userData.duty_station +
                      " " +
                      userData.shop_name +
                      " " +
                      userData.shop_location}
                  </span>
                </span>
                <span className="col-12">
                  <strong>Phone Number: </strong>
                  <span className="text-warning">
                    {userData.user_telephone}
                  </span>
                </span>
                <span className="col-12">
                  <strong>Email: </strong>

                  <span className="text-warning">{userData.user_email}</span>
                </span>
                <span className="col-12">
                  <strong></strong>
                </span>
                <span className="col-12">
                  <strong></strong>
                </span>
              </div>
              <div className="credit col-3 d-flex flex-wrap align-items-center text-left">
                <h5 className="col-12">Credit balance</h5>
                <p className="col-12 text-warning">
                  {FormatMoney(creditBalance, 2)}
                </p>
                <span
                  className="btn btn-secondary mx-1"
                  onClick={() => {
                    setCreditStatus(true);

                    setCredit({
                      ...credit,
                      given_by: currentUserId,
                      given_to: userData.user_id,
                      credit_type: "minus",
                      user_name: userData.first_name + " " + userData.last_name,
                    });
                  }}
                >
                  -
                </span>
                <span
                  className="btn btn-primary mx-1"
                  onClick={() => {
                    setCreditStatus(true);
                    setCredit({
                      ...credit,
                      given_by: currentUserId,
                      given_to: userData.user_id,
                      credit_type: "plus",
                      user_name: userData.first_name + " " + userData.last_name,
                    });
                  }}
                >
                  +
                </span>
              </div>

              {/* BALANCE */}
              <div
                className="credit col-2 d-flex flex-wrap align-items-center text-left"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setIsBalanceActive(true);
                }}
              >
                <h5 className="col-12">Cashier balance</h5>
                <p className="col-12 text-warning">
                  {FormatMoney(chashierBalance, 2)}
                </p>
              </div>
              <div className="actions-div col-2  d-flex">
                {userSession === 0 ? (
                  <button
                    className="btn btn-info"
                    onClick={() => startSession(userData.user_id)}
                  >
                    Start session
                  </button>
                ) : (
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => endSession(userData.user_id)}
                  >
                    End session
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`withdraw-form ${isBalanceActive ? "active" : ""}`}
        id="withdraw-form"
      >
        <form action="" onSubmit={(e) => e.preventDefault()}>
          <h1 className="col-12 text-center">Withdraw balance</h1>
          <h2 className="col-12 text-center">
            {FormatMoney(chashierBalance, 2)}
          </h2>
          <h3 className="pb-2 text-danger hidden bold text-center">
            {balanceMessage}
          </h3>
          <div className="form-groupd col-12 py-3">
            <label htmlFor="amount" className="col-12 text-start">
              Amount {isBalanceActive}
            </label>
            <input
              type="number"
              id="amount1"
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
              id="email1"
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
              id="password1"
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
              onClick={() => {
                if (Number(withdraw.amount) > chashierBalance) {
                  setBalanceMessage("Insufficient balance.");
                  return;
                }

                if (Number(withdraw.amount) <= 0) {
                  setBalanceMessage("Invalid balance input amount.");
                  return;
                }
                WithdrawBalance(withdraw, [
                  document.getElementById("amount1") as HTMLInputElement,
                  document.getElementById("email1") as HTMLInputElement,
                  document.getElementById("password1") as HTMLInputElement,
                ]);
              }}
            >
              Submit
            </button>
            <button
              type="button"
              className="col-4 btn btn-secondary"
              onClick={() => {
                setIsBalanceActive(false);
                setBalanceMessage("");
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

export default Cashier;
