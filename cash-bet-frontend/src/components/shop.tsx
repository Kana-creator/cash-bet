import React, { useEffect, useState } from "react";
import { FaShopify } from "react-icons/fa";
import { FormatMoney } from "./activities/format-money";
import { useNavigate } from "react-router-dom";
import { Credit } from "./modules/credit-module";
import axios from "axios";
import { AppUrl } from "./activities/app-url";

interface Props {
  shopData: {
    date_added: string;
    date_updated: string;
    max_payout: number;
    max_stake: number;
    min_stake: number;
    operator: number;
    sales_limit: number;
    shop_id: number;
    shop_location: string;
    shop_name: string;
    user_id: number;
    manager_id: number;
  };

  handleDelete: (shop_id: number) => void;
  setShowShopForm: React.Dispatch<React.SetStateAction<boolean>>;
  setCreditStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setCredit: React.Dispatch<React.SetStateAction<Credit>>;
  credit: Credit;
  userToken: string;
  currentUserId: number;
}

const Shop: React.FC<Props> = ({
  shopData,
  handleDelete,
  setShowShopForm,
  setCreditStatus,
  setCredit,
  credit,
  userToken,
  currentUserId,
}) => {
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get(`${AppUrl()}/fetch-credit-balance/${shopData.manager_id}`, {
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

  return (
    <div className="user col-md-10 p-1 my-1">
      <div className="user-first-inner col-12 d-flex flex-wrap align-itmes-center">
        <div className="d-flex align-items-center user-name">
          <h4 className="">
            {"100" + shopData.shop_id + " " + shopData.shop_name}
          </h4>
        </div>
        <div className="col-12 d-flex flex-wrap align-items-center">
          <FaShopify className=" px-2 user-icon" />
          <div className="col-11 pl-3 d-flex justify-content-between align-items-center">
            <div className="d-flex flex-wrap">
              <span className="col-12">
                <strong>Location: </strong>
                <span className="text-warning">{shopData.shop_location}</span>
              </span>
              <span className="col-12">
                <strong>Minimum Stake: </strong>

                <span className="text-warning">
                  {FormatMoney(shopData.min_stake, 2)}
                </span>
              </span>
              <span className="col-12">
                <strong>Maximum stake: </strong>

                <span className="text-warning">
                  {FormatMoney(shopData.max_stake, 2)}
                </span>
              </span>
              {/* <span className="col-12">
                <strong>Sales Limit: </strong>

                <span className="text-warning">
                  {FormatMoney(shopData.sales_limit)}
                </span>
              </span> */}
              <span className="col-12">
                <strong>Maximum payout: </strong>

                <span className="text-warning">
                  {FormatMoney(shopData.max_payout, 2)}
                </span>
              </span>
            </div>
            {shopData.manager_id !== 0 ? (
              <div className="credit col-5 d-flex flex-wrap align-items-center text-left">
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
                      given_to: shopData.manager_id,
                      credit_type: "minus",
                      shop_manager: shopData.manager_id,
                      user_name:
                        shopData.shop_name + " " + shopData.shop_location,
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
                      given_to: shopData.manager_id,
                      credit_type: "plus",
                      shop_manager: shopData.manager_id,
                      user_name:
                        shopData.shop_name + " " + shopData.shop_location,
                    });
                  }}
                >
                  +
                </span>
              </div>
            ) : (
              <p className=" credit col-5 d-flex flex-wrap align-items-center text-left">
                This shop has no manager.
              </p>
            )}
            <div className="actions-div d-flex">
              <button
                className="btn btn-info mx-1"
                onClick={() => {
                  navigate(
                    `${`/partner-shops/${shopData.shop_id}/${shopData.operator}`}`
                  );
                  setShowShopForm(true);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-danger mx-1"
                onClick={() => handleDelete(shopData.shop_id)}
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

export default Shop;
