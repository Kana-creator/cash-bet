import React, { useState, useEffect } from "react";
import TextField from "../form-fields/text-field";
import ButtonText from "../buttons/button-text";
import SelectOption from "../form-fields/select-option";
import { UserModule } from "../modules/user-module";
import axios from "axios";
import { AddAdminUser } from "../activities/add-admin-user";
import { useNavigate, useParams } from "react-router-dom";
import { AppUrl } from "../activities/app-url";
import SwitchButton from "../form-fields/shitch-button";
import { AdminRightsModule } from "../modules/admin-rights-module";

interface Props {
  showUserForm: boolean;
  setShowUserForm: React.Dispatch<React.SetStateAction<boolean>>;
  adminRightsModule: AdminRightsModule;
}

// interface AdminRights {
//   view_dashboard: number;
//   view_partners: number;
//   add_partner: number;
//   add_credit: number;
//   block_partner: number;
//   delete_partner: number;
//   view_users: number;
//   add_user: number;
//   edit_user: number;
//   delete_user: number;
//   view_reports: number;
// }

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

interface adminUser extends UserModule {
  view_dashboard: number;
  view_partners: number;
  add_partner: number;
  add_credit: number;
  block_partner: number;
  delete_partner: number;
  view_users: number;
  add_user: number;
  edit_user: number;
  delete_user: number;
  view_reports: number;
}

const AdminUserForm: React.FC<Props> = ({
  showUserForm,
  setShowUserForm,
  adminRightsModule,
}) => {
  const [editableUser, setEditableUser] = useState<UserM[]>([]);
  const [buttonStatus, setButtonStatus] = useState<number>();

  const { user_id } = useParams();
  const [user, setUser] = useState<adminUser>({
    linked_to: 0,
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    user_role: "",
    dutyStation: 0,
    password: "",
    confirmPassword: "",
    view_dashboard: adminRightsModule.view_dashboard,
    view_partners: adminRightsModule.view_partners,
    add_partner: adminRightsModule.add_partner,
    add_credit: adminRightsModule.add_credit,
    block_partner: adminRightsModule.block_partner,
    delete_partner: adminRightsModule.delete_partner,
    view_users: adminRightsModule.view_users,
    add_user: adminRightsModule.add_user,
    edit_user: adminRightsModule.edit_user,
    delete_user: adminRightsModule.delete_user,
    view_reports: adminRightsModule.view_reports,
  });

  useEffect(() => {
    const userData = localStorage.getItem("user") as string;
    const currentUser: UserM = JSON.parse(userData);
    setUser({ ...user, linked_to: currentUser.user_id });
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user") as string;
    const currentUser: UserM = JSON.parse(userData);
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
              view_dashboard: adminRightsModule.view_dashboard,
              view_partners: adminRightsModule.view_partners,
              add_partner: adminRightsModule.add_partner,
              add_credit: adminRightsModule.add_credit,
              block_partner: adminRightsModule.block_partner,
              delete_partner: adminRightsModule.delete_partner,
              view_users: adminRightsModule.view_users,
              add_user: adminRightsModule.add_user,
              edit_user: adminRightsModule.edit_user,
              delete_user: adminRightsModule.delete_user,
              view_reports: adminRightsModule.view_reports,
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
      .post(`${AppUrl()}/update-admin-user/${user_id}`, user, {
        headers: { "x-access-token": user_token },
      })
      .then((res) => {
        setShowUserForm(false);
        navigate("/admin-users");
        window.alert(res.data.message);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="signin__form col-12 d-flex justify-content-center align-items-center">
      <form
        className="col-8 p-4 py-5 d-flex flex-wrap justify-content-center"
        onSubmit={(e: React.FormEvent) => e.preventDefault()}
        style={{ height: "fit-content" }}
      >
        <h3 className="col-12">{user_id ? "Update user" : "Add a new user"}</h3>
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
                    { label: "", value: "" },
                    { label: "internal partner", value: "internal partner" },
                    { label: "other admin", value: "other admin" },
                    { label: "supervisor", value: "supervisor" },
                    { label: "accountant", value: "accountant" },
                  ]
                : [
                    { label: "", value: "" },
                    { label: "internal partner", value: "internal partner" },
                    { label: "other admin", value: "other admin" },
                    { label: "supervisor", value: "supervisor" },
                    { label: "accountant", value: "accountant" },
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

        {user_id ? (
          <div className="col-12 d-flex flex-wrap py-5">
            {editableUser[0]?.user_role !== "internal partner" ? (
              <>
                <h3 className="col-12 py-4 mt-4">Admin rights</h3>
                <div className="col-6 p-3 d-flex align-items-center">
                  <p className="col-6 fs-6">View dashboard</p>
                  <SwitchButton
                    onClick={() => {
                      console.log(user.view_dashboard);
                      setUser({
                        ...user,
                        view_dashboard: user.view_dashboard === 1 ? 0 : 1,
                      });
                    }}
                    status={adminRightsModule.view_dashboard}
                  />
                </div>
                <div className="col-6 p-3 d-flex  align-items-center">
                  <p className="col-6 fs-6"> View partners</p>
                  <SwitchButton
                    onClick={() => {
                      setUser({
                        ...user,
                        view_partners: user.view_partners === 1 ? 0 : 1,
                      });
                    }}
                    status={adminRightsModule.view_partners}
                  />
                </div>
                <div className="col-6 p-3 d-flex  align-items-center">
                  <p className="col-6 fs-6">Add partner</p>
                  <SwitchButton
                    onClick={() => {
                      setUser({
                        ...user,
                        add_partner: user.add_partner === 1 ? 0 : 1,
                      });
                    }}
                    status={adminRightsModule.add_partner}
                  />
                </div>
                <div className="col-6 p-3 d-flex  align-items-center">
                  <p className="col-6 fs-6">Add credit</p>
                  <SwitchButton
                    onClick={() => {
                      setUser({
                        ...user,
                        add_credit: user.add_credit === 1 ? 0 : 1,
                      });
                    }}
                    status={adminRightsModule.add_credit}
                  />
                </div>
                <div className="col-6 p-3 d-flex  align-items-center">
                  <p className="col-6 fs-6">Block partner</p>

                  <SwitchButton
                    onClick={() => {
                      setUser({
                        ...user,
                        block_partner: user.block_partner === 1 ? 0 : 1,
                      });
                    }}
                    status={adminRightsModule.block_partner}
                  />
                </div>
                <div className="col-6 p-3 d-flex  align-items-center">
                  <p className="col-6 fs-6">Delete partner</p>

                  <SwitchButton
                    onClick={() => {
                      setUser({
                        ...user,
                        delete_partner: user.delete_partner === 1 ? 0 : 1,
                      });
                    }}
                    status={adminRightsModule.delete_partner}
                  />
                </div>
                <div className="col-6 p-3 d-flex  align-items-center">
                  <p className="col-6 fs-6">View users</p>
                  <SwitchButton
                    onClick={() => {
                      setUser({
                        ...user,
                        view_users: user.view_users === 1 ? 0 : 1,
                      });
                    }}
                    status={adminRightsModule.view_users}
                  />
                </div>
                <div className="col-6 p-3 d-flex  align-items-center">
                  <p className="col-6 fs-6">Add user</p>
                  <SwitchButton
                    onClick={() => {
                      setUser({
                        ...user,
                        add_user: user.add_user === 1 ? 0 : 1,
                      });
                    }}
                    status={adminRightsModule.add_user}
                  />
                </div>
                <div className="col-6 p-3 d-flex  align-items-center">
                  <p className="col-6 fs-6">Edit user</p>
                  <SwitchButton
                    onClick={() => {
                      setUser({
                        ...user,
                        edit_user: user.edit_user === 1 ? 0 : 1,
                      });
                    }}
                    status={adminRightsModule.edit_user}
                  />
                </div>
                <div className="col-6 p-3 d-flex  align-items-center">
                  <p className="col-6 fs-6">Delete user</p>
                  <SwitchButton
                    onClick={() => {
                      setUser({
                        ...user,
                        delete_user: user.delete_user === 1 ? 0 : 1,
                      });
                    }}
                    status={adminRightsModule.delete_user}
                  />
                </div>
                <div className="col-6 p-3 d-flex  align-items-center">
                  <p className="col-6 fs-6">View reports</p>
                  <SwitchButton
                    onClick={() => {
                      setUser({
                        ...user,
                        view_reports: user.view_reports === 1 ? 0 : 1,
                      });
                    }}
                    status={adminRightsModule.view_reports}
                  />
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

        <div className="col-12 d-flex justify-content-center py-5">
          {user_id ? (
            <ButtonText
              value={`${user_id ? "Save changes" : "Submit"}`}
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
              navigate("/admin-users");
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default AdminUserForm;
