import React from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Credit } from "./modules/credit-module";
import { AdminRightsModule } from "./modules/admin-rights-module";
import { AppUrl } from "./activities/app-url";
import axios from "axios";

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

  handleDelete: (user_id: number) => void;
  setShowUserForm: React.Dispatch<React.SetStateAction<boolean>>;
  setAdminRights: React.Dispatch<React.SetStateAction<AdminRightsModule>>;
  currentUserAdminRights: AdminRightsModule[];
}

const AdminUser: React.FC<Props> = ({
  userData,
  handleDelete,
  setShowUserForm,
  setAdminRights,
  currentUserAdminRights,
  // setCreditStatus,
  // setCredit,
  // credit,
}) => {
  const navigate = useNavigate();

  const fetchAdminRights = (user_id: number, user_role: string) => {
    const token: string = localStorage.getItem("token") as string;
    axios
      .get(`${AppUrl()}/fetch-admin-rights/${user_id}/${user_role}`, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.data.status === "error") {
          window.alert(res.data.message);
        } else {
          setAdminRights(res.data.adminRights[0]);
          navigate(`/admin-users/${userData.user_id}`);
          setShowUserForm(true);
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="user col-md-10 p-1 my-1">
      <div className="user-first-inner col-12 d-flex flex-wrap align-itmes-center">
        <div className="d-flex align-items-center user-name">
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
            <div className="col-8 d-flex align-items-center justify-content-around">
              <div className="col d-flex flex-wrap">
                <span className="col-12">
                  <strong>Role: </strong>
                  <i className="text-warning">{userData.user_role}</i>
                </span>

                <span className="col-12">
                  <strong>Phone Number: </strong>
                  <i className="text-warning">{userData.user_telephone}</i>
                </span>
                <span className="col-12">
                  <strong>Email: </strong>
                  <i className="text-warning">{userData.user_email}</i>
                </span>
              </div>
            </div>

            <div className="actions-div">
              {/* <button className="btn btn-secondary mx-1" onClick={() => {}}>
                Details
              </button> */}
              <button
                className="btn btn-info mx-1"
                onClick={() => {
                  fetchAdminRights(userData.user_id, userData.user_role);
                }}
                style={{
                  visibility: `${
                    currentUserAdminRights[0].edit_user === 0
                      ? "hidden"
                      : "visible"
                  }`,
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-danger mx-1"
                onClick={() => {
                  handleDelete(userData.user_id);
                }}
                style={{
                  visibility: `${
                    currentUserAdminRights[0].delete_user === 0
                      ? "hidden"
                      : "visible"
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

export default AdminUser;
