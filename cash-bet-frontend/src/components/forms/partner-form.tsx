import React, { useState, useEffect } from "react";
import TextField from "../form-fields/text-field";
import ButtonText from "../buttons/button-text";
import SelectOption from "../form-fields/select-option";
import { UserModule } from "../modules/user-module";
import axios from "axios";
import { AddAdminUser } from "../activities/add-admin-user";
import { useNavigate, useParams } from "react-router-dom";
import { AppUrl } from "../activities/app-url";

interface Props {
  setShowPartnerForm: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserM {
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

const PartnerForm: React.FC<Props> = ({ setShowPartnerForm }) => {
  const [editableUser, setEditableUser] = useState<UserM[]>([]);

  const { user_id } = useParams();
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
  });

  useEffect(() => {
    const userData = localStorage.getItem("user") as string;
    const currentUser: UserM = JSON.parse(userData);
    setUser({ ...user, linked_to: currentUser.user_id });
  }, []);

  useEffect(() => {
    const token: string = localStorage.getItem("token") as string;
    if (user_id) {
      axios
        .get(`${AppUrl()}/fetch-admin-user-details/${user_id}`, {
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
  }, [user_id]);

  const navigate = useNavigate();

  const handleUpdate = () => {
    const user_token: string = localStorage.getItem("token") as string;
    axios
      .post(`${AppUrl()}/update-user/${user_id}`, user, {
        headers: { "x-access-token": user_token },
      })
      .then((res) => {
        setShowPartnerForm(false);
        navigate("/admin-users");
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
        <h3 className="col-12">Add a new partner</h3>
        <div className="col-12">
          <SelectOption
            span="*"
            className="form-group my-3 px-4 col-md-6 "
            label="User Category"
            id="user-category"
            options={
              user_id
                ? [
                    {
                      label: editableUser[0]?.user_role,
                      value: editableUser[0]?.user_role,
                    },
                    { label: "SELECT USER ROLE", value: "" },
                    { label: "Partner", value: "partner" },
                  ]
                : [
                    { label: "SELECT USER ROLE", value: "" },
                    { label: "Partner", value: "partner" },
                  ]
            }
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setUser({ ...user, user_role: e.target.value })
            }
          />
        </div>
        <TextField
          span="*"
          className="form-group my-3 px-4 col-md-6 "
          label="First name"
          type="text"
          id="user-first-name"
          value={user_id ? editableUser[0]?.first_name : ""}
          autoFocus={true}
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
          value={user_id ? editableUser[0]?.last_name : ""}
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
          value={user_id ? editableUser[0]?.user_email : ""}
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
          value={user_id ? editableUser[0]?.user_telephone : ""}
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
              value="Submit"
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
                AddAdminUser(
                  [
                    document.getElementById(
                      "user-category"
                    ) as HTMLInputElement,
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
                  setShowPartnerForm
                );
              }}
            />
          )}
          <ButtonText
            value="Cancel"
            className="my-4 px-4 col-md-4 dark"
            id="cancel-add-user"
            action={() => {
              setShowPartnerForm(false);
              navigate("/partners");
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default PartnerForm;
