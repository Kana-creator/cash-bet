import React, { useState, useEffect } from "react";
import Shop from "./shop";
import axios from "axios";
import { AppUrl } from "./activities/app-url";
import { MdSettings } from "react-icons/md";
import { UserLogOut } from "./activities/signout-action";
import { Credit } from "./modules/credit-module";
import { Transact } from "./activities/credit-transaction";

interface Props {
  showShopForm: boolean;
  setShowShopForm: React.Dispatch<React.SetStateAction<boolean>>;
}

interface shop {
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
  search_string?: string;
  manager_id: number;
}

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

const Shops: React.FC<Props> = ({ showShopForm, setShowShopForm }) => {
  const [shops, setShops] = useState<shop[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [searchResults, setSearchResults] = useState<shop[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [searchField, setSearchField] = useState<string>("");
  const [shopsLength, setShopsLength] = useState<number>(0);
  const [userToken, setUserToken] = useState<string>("");
  const [creditStatus, setCreditStatus] = useState<boolean>(false);

  const [credit, setCredit] = useState<Credit>({
    given_by: 0,
    given_to: 0,
    credit_amount: 0,
    credit_type: "",
    shop_manager: 0,
    user_role: "",
  });

  useEffect(() => {
    const currentUser: User = JSON.parse(
      localStorage.getItem("user") as string
    );

    setCurrentUserRole(currentUser.user_role);
    setCurrentUserName(currentUser.first_name);
    setCurrentUserId(currentUser.user_id);

    setCredit({
      ...credit,
      given_by: currentUser.user_id,
      user_role: currentUser.user_role,
    });

    const token: string = localStorage.getItem("token") as string;
    setUserToken(token);

    axios
      .get(`${AppUrl()}/fetchShops/${currentUser.user_id}`, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.data.status === "error") {
          setErrorMessage(res.data.message);
        } else {
          setShops(res.data.shops);
          setShopsLength(res.data.shops.length);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSearch = (search_value: HTMLInputElement) => {
    setSearchField(search_value.value);

    const newShops = shops.filter((s) =>
      // s.shop_name.toLowerCase().includes(search_value.value) ||
      JSON.stringify(s.shop_id).includes(search_value.value.slice(3))
    );

    if (search_value.value !== "") {
      setSearchResults(newShops);
      setShopsLength(newShops.length);
    } else {
      setShopsLength(shops.length);
      setSearchResults([]);
    }
  };

  const handleDelete = (shop_id: number) => {
    const confirm_delete = window.confirm(
      "Are you sure you want to delete this shop?"
    );
    if (confirm_delete) {
      axios
        .delete(`${AppUrl()}/delete-shop/${shop_id}`, {
          headers: { "x-access-token": userToken },
        })
        .then((res) => {
          if (res.data.status === "error") {
            window.alert(res.data.message);
          } else {
            const newShops = shops.filter((s) => s.shop_id !== shop_id);
            setShops(newShops);
            setSearchField("");
            window.alert(res.data.message);
          }
        })
        .catch((error) => window.alert(error));
    }
  };

  return (
    <div className="shops col-12 d-flex flex-wrap justify-content-center pb-4">
      <div className="page-heading col-10 d-flex justify-content-around mb-4 p-4">
        <h4>Shops</h4>
        <span
          className="d-flex align-items-center"
          style={{ height: "fit-content" }}
        >
          <span className="px-4 fs-4 bg-light text-danger">{shopsLength}</span>
          <span
            className="btn btn-secondary"
            onClick={() => setShowShopForm(true)}
          >
            Add shop
          </span>{" "}
        </span>
        <form action="" className="col-4">
          <input
            type="search"
            name=""
            id="search-user"
            className="form-control col-12"
            placeholder="Search for a shop.."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSearch(e.target)
            }
          />
        </form>
        <details className="position-relative  bg-dark px-3 py-1">
          <summary>
            <span>
              {currentUserName} {<MdSettings />}
            </span>
          </summary>
          <p className="btn btn-secondary px-2 py-2 col-12 mt-3">Profile</p>
          <p
            className="btn btn-secondary px-2 py-2 col-12"
            onClick={() => UserLogOut(currentUserRole, currentUserId)}
          >
            Logout
          </p>
        </details>
      </div>
      {searchField.length === 0 ? (
        shops.length !== 0 ? (
          <div
            className="shops pt-5 mt-5 col-12 d-flex flex-wrap justify-content-center"
            style={{ height: "fit-content" }}
          >
            {shops.map((shop, index) => (
              <Shop
                key={index}
                shopData={shop}
                handleDelete={handleDelete}
                setShowShopForm={setShowShopForm}
                setCreditStatus={setCreditStatus}
                setCredit={setCredit}
                credit={credit}
                userToken={userToken}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        ) : (
          <div className=" col-12 d-flex flex-wrap justify-content-center align-items-center">
            <h1 className="text-danger">{errorMessage}</h1>
          </div>
        )
      ) : searchResults.length !== 0 ? (
        <div
          className="pt-5 mt-5 col-12 d-flex flex-wrap justify-content-center"
          style={{ height: "fit-content" }}
        >
          {searchResults.map((shop, index) => (
            <Shop
              key={index}
              shopData={shop}
              handleDelete={handleDelete}
              setShowShopForm={setShowShopForm}
              setCreditStatus={setCreditStatus}
              setCredit={setCredit}
              credit={credit}
              userToken={userToken}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      ) : (
        <div className=" col-12 d-flex flex-wrap justify-content-center align-items-center">
          <h1 className="text-danger">No Shop Found!</h1>
        </div>
      )}

      <div
        className={`col-12 p-4 credit-action-div ${
          creditStatus ? "active" : ""
        }`}
      >
        <span
          className="btn btn-danger close-credit-div"
          onClick={() => {
            setCreditStatus(false);
            setCredit({
              given_by: 0,
              given_to: 0,
              credit_amount: 0,
              credit_type: "",
              user_name: "",
              shop_manager: 0,
              user_role: "",
            });
          }}
        >
          X
        </span>

        <form
          onSubmit={(e: React.FormEvent) => e.preventDefault()}
          className="col-md-6 p-4 alert alert-info"
        >
          {credit.credit_type === "plus" ? (
            <h4 className="my-3">Add credit to {credit.user_name}</h4>
          ) : (
            <h4 className="my-3">Reduce credit from {credit.user_name}</h4>
          )}

          <div className="form-group">
            <input
              type="number"
              id="transaction-amount"
              className="col-12 form-control fs-5"
              placeholder="Enter credit amount here..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCredit({
                  ...credit,
                  credit_amount: parseInt(e.target.value),
                })
              }
            />
            <small className="text-danger"></small>
          </div>
          <div className="d-flex col-12 justify-content-center">
            <span
              className="btn btn-primary my-4 mx-2 fs-5"
              onClick={() =>
                Transact(
                  credit,
                  setCredit,
                  setCreditStatus,
                  userToken,
                  document.getElementById(
                    "transaction-amount"
                  ) as HTMLInputElement,
                  currentUserId,
                  currentUserRole
                )
              }
            >
              Submit
            </span>
            <span
              className="btn btn-secondary my-4 mx-2 fs-5"
              onClick={() => {
                setCreditStatus(false);
                setCredit({
                  given_by: 0,
                  given_to: 0,
                  credit_amount: 0,
                  credit_type: "",
                  user_name: "",
                  shop_manager: 0,
                  user_role: "",
                });
                const field = document.getElementById(
                  "transaction-amount"
                ) as HTMLInputElement;
                field.value = "";
              }}
            >
              cancel
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Shops;
