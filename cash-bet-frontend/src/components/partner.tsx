import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Credit } from "./modules/credit-module";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import { FormatMoney } from "./activities/format-money";
import { AdminRightsModule } from "./modules/admin-rights-module";

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
    user_email: string;
    user_id: number;
    user_password: string;
    user_role: string;
    user_telephone: string;
  };

  handleDelete: (user_id: number) => any;
  handleBlock: (user_id: number) => any;
  handleUnBlock: (user_id: number) => void;
  setCreditStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setCredit: React.Dispatch<React.SetStateAction<Credit>>;
  credit: Credit;
  userToken: string;
  currentUserId: number;
  adminRights: AdminRightsModule[];
}

const Partner: React.FC<Props> = ({
  userData,
  handleDelete,
  handleBlock,
  handleUnBlock,
  setCreditStatus,
  setCredit,
  credit,
  userToken,
  currentUserId,
  adminRights,
}) => {
  const [blockStatus, setBlockStatus] = useState<number>(0);
  const [creditBalance, setCreditBalance] = useState<number>(0);

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

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get(`${AppUrl()}/fetch-block-status/${userData.user_id}`, {
          headers: { "x-access-token": userToken },
        })
        .then((res) => {
          if (res.data.status === "success") {
            setBlockStatus(res.data.block_status.block_status);
          } else {
            window.alert(res.data.message);
          }
        })
        .catch((error) => console.log(error));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="user col-md-11 p-1 px-3 my-1">
      <div className="user-first-inner col-12 d-flex flex-wrap align-itmes-center">
        <div className="d-flex align-items-center user-name">
          <h4 className="">
            {"300" +
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
            <div className="col-8 d-flex align-items-center justify-content-around">
              <div className="col-4 d-flex flex-wrap">
                <span className="col-12">
                  <strong>Role: </strong>
                  <span className="text-warning">{userData.user_role}</span>
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
              <div className="credit col-4 d-flex flex-wrap align-items-center text-left">
                <h5 className="col-12">Credit balance</h5>
                {userData.user_role !== "operator" ? (
                  <>
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
                          user_name:
                            userData.first_name + " " + userData.last_name,
                        });
                      }}
                      style={{
                        display: `${
                          adminRights[0].add_credit === 0 ? "none" : "block"
                        }`,
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
                          user_name:
                            userData.first_name + " " + userData.last_name,
                        });
                      }}
                      style={{
                        display: `${
                          adminRights[0].add_credit === 0 ? "none" : "block"
                        }`,
                      }}
                    >
                      +
                    </span>
                  </>
                ) : (
                  <p>NA</p>
                )}
              </div>
            </div>

            <div
              className="actions-div col-4 d-flex justify-content-end align-items-center"
              style={{ height: "fit-content" }}
            >
              {/* <button className="btn btn-info mx-1" onClick={() => {}}>
                Details
              </button> */}
              {blockStatus === 0 ? (
                <button
                  className="btn btn-dark mx-1"
                  onClick={() => handleBlock(userData.user_id)}
                  style={{
                    display: `${
                      adminRights[0].block_partner === 0 ? "none" : "block"
                    }`,
                  }}
                >
                  Block
                </button>
              ) : (
                <button
                  className="btn btn-secondary mx-1"
                  onClick={() => handleUnBlock(userData.user_id)}
                  style={{
                    display: `${
                      adminRights[0].block_partner === 0 ? "none" : "block"
                    }`,
                  }}
                >
                  Un Block
                </button>
              )}
              <button
                className="btn btn-danger mx-1"
                onClick={() => handleDelete(userData.user_id)}
                style={{
                  display: `${
                    adminRights[0].delete_partner === 0 ? "none" : "block"
                  }`,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partner;
