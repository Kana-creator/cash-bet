import React, { useState, useEffect } from "react";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";
import { MdDashboard } from "react-icons/md";
import UserForm from "../forms/user-form";
import "../styles/user-page-style.css";
import AdminUserForm from "../forms/admin-user-form";
import AdminUsers from "../admin-users";
import { AdminRightsModule } from "../modules/admin-rights-module";
import axios from "axios";
import { AppUrl } from "../activities/app-url";

interface Props {
  currentUserAdminRights: AdminRightsModule[];
  setCurrentUserAdminRights: React.Dispatch<
    React.SetStateAction<AdminRightsModule[]>
  >;
}

interface User {
  linked_to?: number;
  first_name: string;
  last_name: string;
  email?: string;
  telephone: string;
  user_role: string;
  dutyStation?: number;
  password: string;
  confirmPassword?: string;
  user_id: number;
  token: string;
}

const AdminUsersPage: React.FC<Props> = ({
  currentUserAdminRights,
  setCurrentUserAdminRights,
}) => {
  const [showUserForm, setShowUserForm] = useState<boolean>(false);
  const [adminRights, setAdminRights] = useState<AdminRightsModule>({
    view_dashboard: 0,
    view_partners: 0,
    add_partner: 0,
    add_credit: 0,
    block_partner: 0,
    delete_partner: 0,
    view_users: 0,
    add_user: 0,
    edit_user: 0,
    delete_user: 0,
    view_reports: 0,
  });
  const [links, setLinks] = useState<NavLinkModule[]>([]);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const current_user: {
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
    } = JSON.parse(localStorage.getItem("user") as string);
    setUserRole(current_user.user_role);
  }, []);

  useEffect(() => {
    const currentUser: User = JSON.parse(
      localStorage.getItem("user") as string
    );
    const userToken = localStorage.getItem("token");
    axios
      .get(
        `${AppUrl()}/fetch-admin-rights/${currentUser.user_id}/${
          currentUser.user_role
        }`,
        {
          headers: { "x-access-token": userToken },
        }
      )
      .then((res) => {
        localStorage.setItem(
          "adminRights",
          JSON.stringify(res.data.adminRights)
        );
        setCurrentUserAdminRights([...res.data.adminRights]);
        console.log(res.data.adminRights);

        setLinks([
          {
            lable: "Dashbord",
            link: "/admin-dashboard",
            view: res.data.adminRights[0].view_dashboard,
          },

          {
            lable: "Partners",
            link: "/partners",
            view: res.data.adminRights[0].view_partners,
          },
          {
            lable: "Users",
            link: "/admin-users",
            status: "active",
            view: res.data.adminRights[0].view_users,
          },

          {
            lable: "Reports",
            link: "/admin-reports",
            view: res.data.adminRights[0].view_reports,
          },

          {
            lable: "Withdraws",
            link: "/admin-withdraw-report",
            view: res.data.adminRights[0].view_reports,
          },
          {
            lable: "Credit",
            link: "/credit-report",
          },
        ]);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="main col-12">
      <div className="body d-flex flex-wrap">
        <h1 className="logo">BETCRANE</h1>
        <SideBar navLinks={links} setNavLinks={setLinks} />

        <div className="col-md-10 d-flex flex-wrap justify-content-center height-auto">
          {!showUserForm ? (
            <AdminUsers
              showUserForm={showUserForm}
              setShowUserForm={setShowUserForm}
              setAdminRights={setAdminRights}
              currentUserAdminRights={currentUserAdminRights}
            />
          ) : (
            <AdminUserForm
              showUserForm={showUserForm}
              setShowUserForm={setShowUserForm}
              adminRightsModule={adminRights}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
