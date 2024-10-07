import React, { useState, useEffect } from "react";
import TextField from "../form-fields/text-field";
import ButtonText from "../buttons/button-text";
import SelectOption from "../form-fields/select-option";
import { Adduser } from "../activities/add-user-action";
import { UserModule } from "../modules/user-module";
import axios from "axios";
import { AppUrl } from "../activities/app-url";
import { SelectOptionsModule } from "../modules/select-options-module";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
  showUserForm: boolean;
  setShowUserForm: React.Dispatch<React.SetStateAction<boolean>>;
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

interface EditableUser {
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

interface Shop {
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
}

const UserForm: React.FC<Props> = ({ showUserForm, setShowUserForm }) => {
  const [user, setUser] = useState<UserModule>({
    linked_to: 0,
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    user_role: "",
    dutyStation: 0,
    password: "",
    confirmPassword: "",
    company_name: "",
    logo: "",
  });

  const [editableUser, setEditableUser] = useState<EditableUser[]>([]);
  const [currentUserToken, setCurrentUserToken] = useState<string>("");
  const [options, setOptions] = useState<SelectOptionsModule[]>([]);
  const [userRole, setUserRole] = useState<string>("");

  const navigate = useNavigate();
  const { user_id } = useParams();

  // fetch user's duty station
  useEffect(() => {
    const userData = localStorage.getItem("user") as string;
    const currentUser: User = JSON.parse(userData);
    setUser({ ...user, linked_to: currentUser.user_id });

    const token: string = localStorage.getItem("token") as string;
    setCurrentUserToken(token);

    axios
      .get(`${AppUrl()}/fetch-duty-stations/${currentUser.user_id}`, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        setOptions([
          { label: "SELECT DUTY STATION", value: "" },

          ...res.data.shops.map((shop: Shop) => {
            return {
              label:
                "Shop100" +
                shop.shop_id +
                " " +
                shop.shop_name +
                " " +
                shop.shop_location,
              value: `${shop.shop_id}`,
            };
          }),
        ]);
      })
      .catch((error) => console.log(error));
  }, []);

  // fetch user details
  useEffect(() => {
    const token: string = localStorage.getItem("token") as string;
    if (user_id) {
      axios
        .get(`${AppUrl()}/fetch-user-details/${user_id}`, {
          headers: { "x-access-token": token },
        })
        .then((res) => {
          if (res.data.status === "success") {
            setEditableUser([res.data.user]);
            setUser({
              linked_to: res.data.user.linked_to,
              firstName: res.data.user.first_name,
              lastName: res.data.user.last_name,
              email: res.data.user.user_email,
              telephone: res.data.user.user_telephone,
              user_role: res.data.user.user_role,
              dutyStation: res.data.user.duty_station,
              password: "",
              confirmPassword: "",
            });
          } else {
            window.alert(res.data.message);
          }
        })
        .catch((error) => console.log(error));
    }
    return;
  }, []);

  // update user's info
  const handleUpdate = () => {
    axios
      .post(`${AppUrl()}/update-user/${user_id}`, user, {
        headers: { "x-access-token": currentUserToken },
      })
      .then((res) => {
        setShowUserForm(false);
        navigate("/partner-users");
        window.alert(res.data.message);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="signin__form col-12 d-flex justify-content-center align-items-center">
      <form
        className="col-8 p-4 d-flex flex-wrap justify-content-center"
        onSubmit={(e: React.FormEvent) => e.preventDefault()}
        style={{ height: "fit-content" }}
      >
        <h3 className="col-12"> {user_id ? "Edit user" : "Add a new user"}</h3>
        {/* <div className="col-12"> */}
        <SelectOption
          span="*"
          className="form-group my-3 px-4 col-md-6 "
          label="User Category"
          id="user-category"
          options={
            user_id
              ? [
                  {
                    label: `${user.user_role}`,
                    value: `${user.user_role}`,
                  },
                  { label: "SELECT USER CATEGORY", value: "" },
                  { label: "Operator", value: "operator" },
                  { label: "Manager", value: "manager" },
                  { label: "Cashier", value: "cashier" },
                ]
              : [
                  { label: "SELECT USER CATEGORY", value: "" },
                  { label: "Operator", value: "operator" },
                  { label: "Manager", value: "manager" },
                  { label: "Cashier", value: "cashier" },
                ]
          }
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setUserRole(e.target.value);
            setUser({ ...user, user_role: e.target.value });
          }}
        />

        <SelectOption
          span="*"
          className="form-group my-3 px-4 col-md-6 "
          label="Duty Station"
          id="duty-station"
          options={
            user_id
              ? [
                  {
                    label: `${editableUser.map(
                      (eu) =>
                        "100" +
                        eu.shop_id +
                        " " +
                        eu.shop_name +
                        " " +
                        eu.shop_location
                    )}`,
                    value: `${editableUser.map((eu) => eu.duty_station)}`,
                  },
                  ...options,
                ]
              : [...options]
          }
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setUser({ ...user, dutyStation: parseInt(e.target.value) });
            console.log(user);
          }}
        />

        {/* </div> */}
        <TextField
          span="*"
          className="form-group my-3 px-4 col-md-6 "
          label="First name"
          type="text"
          id="user-first-name"
          value={user_id ? user.firstName : ""}
          autoFocus={false}
          placeholder="Enter first name here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser({ ...user, firstName: e.target.value })
          }
          onKeyUp={() => {}}
        />

        <TextField
          span="*"
          className="form-group my-3 px-4 col-md-6 "
          label="Last name"
          type="text"
          id="user-last-name"
          value={user_id ? user.lastName : ""}
          autoFocus={false}
          placeholder="Enter last name here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser({ ...user, lastName: e.target.value })
          }
          onKeyUp={() => {}}
        />

        <TextField
          span=""
          className="form-group my-3 px-4 col-md-6 "
          label="Email"
          type="text"
          id="user-email"
          value={`${user_id ? user.email : ""}`}
          autoFocus={false}
          placeholder="Enter Email here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser({ ...user, email: e.target.value })
          }
          onKeyUp={() => {}}
        />

        <TextField
          span="*"
          className="form-group my-3 px-4 col-md-6 "
          label="Phone number"
          type="phone"
          id="user-phone"
          value={`${user_id ? user.telephone : ""}`}
          autoFocus={false}
          placeholder="Enter phone number here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser({ ...user, telephone: e.target.value })
          }
          onKeyUp={() => {}}
        />

        <TextField
          span="*"
          className="form-group my-3 px-4 col-md-6 "
          label="Password"
          type="password"
          id="user-password"
          value={""}
          autoFocus={false}
          placeholder="Enter password here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser({ ...user, password: e.target.value })
          }
          onKeyUp={() => {}}
        />

        <TextField
          span="*"
          className="form-group my-3 px-4 col-md-6 "
          label="Confirm Password"
          type="password"
          id="confirm-password"
          value={""}
          autoFocus={false}
          placeholder="Confirm password here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser({ ...user, confirmPassword: e.target.value })
          }
          onKeyUp={() => {}}
        />
        <div className="col-12 d-flex justify-content-center">
          {user_id ? (
            <ButtonText
              value="Update"
              className="form-group my-4 px-4 col-md-4"
              id="add__user__btn"
              action={() => handleUpdate()}
            />
          ) : (
            <ButtonText
              value="Submit"
              className="form-group my-4 px-4 col-md-4"
              id="add__user__btn"
              action={() => {
                Adduser(
                  [
                    document.getElementById(
                      "user-category"
                    ) as HTMLInputElement,
                    document.getElementById("duty-station") as HTMLInputElement,
                    document.getElementById(
                      "user-first-name"
                    ) as HTMLInputElement,
                    document.getElementById(
                      "user-last-name"
                    ) as HTMLInputElement,
                    document.getElementById("user-email") as HTMLInputElement,
                    document.getElementById("user-phone") as HTMLInputElement,
                    document.getElementById(
                      "user-password"
                    ) as HTMLInputElement,
                    document.getElementById(
                      "confirm-password"
                    ) as HTMLInputElement,
                  ],

                  axios,
                  user,
                  setShowUserForm
                );
              }}
            />
          )}
          <ButtonText
            value="Cancel"
            className="my-4 px-4 col-md-4 dark"
            id="cancel-add-user"
            action={() => {
              setShowUserForm(false);
              navigate("/partner-users");
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default UserForm;
