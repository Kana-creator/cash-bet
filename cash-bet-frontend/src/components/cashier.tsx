import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Credit } from "./modules/credit-module";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import { FormatMoney } from "./activities/format-money";
import { error } from "console";

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
  const navigate = useNavigate();

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
  }, []);

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
    </div>
  );
};

export default Cashier;
