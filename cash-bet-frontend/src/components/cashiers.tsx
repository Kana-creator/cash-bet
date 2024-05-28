import React, { useState, useEffect } from "react";
import User from "./user";
import { AppUrl } from "./activities/app-url";
import axios from "axios";
import { MdSettings } from "react-icons/md";
import { UserLogOut } from "./activities/signout-action";
import { Credit } from "./modules/credit-module";
import { Transact } from "./activities/credit-transaction";
import Cashier from "./cashier";
import ScreenPreloader from "./screen-preloader";

interface Props {
  showUserForm: boolean;
  setShowUserForm: React.Dispatch<React.SetStateAction<boolean>>;
  setManagerCreditBalance: React.Dispatch<React.SetStateAction<number>>;
}

interface User {
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
}

const Cashiers: React.FC<Props> = ({
  showUserForm,
  setShowUserForm,
  setManagerCreditBalance,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [searchField, setSearchField] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [usersLength, setUsersLength] = useState<number>(0);
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

    const user_id: number = currentUser.user_id;
    const shop_id: string = currentUser.duty_station;
    const token: string = localStorage.getItem("token") as string;

    setUserToken(token);
    setCredit({
      ...credit,
      given_by: currentUser.user_id,
      user_role: currentUser.user_role,
    });

    axios
      .get(`${AppUrl()}/fetchCashiers/${shop_id}`, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.data.status === "error") {
          setErrorMessage(res.data.message);
        } else {
          setUsers([...res.data.users]);
          setUsersLength(res.data.users.length);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user") as string;
    const current_user: User = JSON.parse(user);

    const userToken: string = localStorage.getItem("token") as string;

    axios
      .get(`${AppUrl()}/fetch-credit-balance/${current_user.user_id}`, {
        headers: { "x-access-token": userToken },
      })
      .then((res) => {
        if (res.data.status === "success") {
          setManagerCreditBalance(res.data.credit_balance.available_credit);
        } else {
          window.alert(res.data.message);
        }
      })
      .catch((error) => console.log(error));
  });

  const handleSearch = (search_value: HTMLInputElement) => {
    setSearchField(search_value.value);

    const newUsers = users.filter((u: User) =>
      u.first_name.toLowerCase().includes(search_value.value)
    );

    if (search_value.value !== "") {
      setSearchResults(newUsers);
      setUsersLength(newUsers.length);
    } else {
      setUsersLength(users.length);
      setSearchResults([]);
    }
  };

  return users.length === 0 ? (
    <div className="shops col-12 d-flex flex-wrap justify-content-center">
      <ScreenPreloader />
    </div>
  ) : (
    <div className="pt-5 mt-5  shops col-12 d-flex flex-wrap justify-content-center">
      {/* <form
        action=""
        className="col-4 pt-2 bg-danger"
        style={{ height: "fit-content" }}
      >
        <input
          type="search"
          name=""
          id="search-user"
          className="form-control col-12"
          placeholder="Search for a user.."
          defaultValue={searchField}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleSearch(e.target)
          }
        />
      </form> */}

      {searchField.length === 0 ? (
        users.length !== 0 ? (
          <div
            className="col-12 d-flex flex-wrap justify-content-center"
            style={{ height: "fit-content" }}
          >
            {users.map((user, index) => (
              <Cashier
                key={index}
                userData={user}
                setShowUserForm={setShowUserForm}
                setCreditStatus={setCreditStatus}
                setCredit={setCredit}
                credit={credit}
                userToken={userToken}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        ) : (
          <div className="col-12 d-flex flex-wrap justify-content-center align-items-center">
            <h1 className="text-danger">{errorMessage}</h1>
          </div>
        )
      ) : searchResults.length !== 0 ? (
        <div
          className="col-12 d-flex flex-wrap justify-content-center"
          style={{ height: "fit-content" }}
        >
          {searchResults.map((user, index) => (
            <Cashier
              key={index}
              userData={user}
              setShowUserForm={setShowUserForm}
              setCreditStatus={setCreditStatus}
              setCredit={setCredit}
              credit={credit}
              userToken={userToken}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      ) : (
        <div className="col-12 d-flex flex-wrap justify-content-center align-items-center">
          <h1 className="text-danger">No User Found!</h1>
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
              autoComplete="false"
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

export default Cashiers;
