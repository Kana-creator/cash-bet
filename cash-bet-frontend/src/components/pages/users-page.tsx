import React, { useState } from "react";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";
import { MdDashboard } from "react-icons/md";
import UserForm from "../forms/user-form";
import Users from "../users";
import "../styles/user-page-style.css";

const UsersPage: React.FC = () => {
  const [showUserForm, setShowUserForm] = useState<boolean>(false);
  const [links, setLinks] = useState<NavLinkModule[]>([
    {
      lable: "Dashbord",
      link: "/admin-page",
      icon: MdDashboard,
    },
    {
      lable: "Partners",
      link: "/partners",
    },
    {
      lable: "Users",
      link: "/users",
    },
  ]);
  // const [userRole, setUserRole] = useState<string>("");

  // useEffect(() => {
  //   const current_user: {
  //     date_added: string;
  //     date_updated: string;
  //     duty_station: string;
  //     first_name: string;
  //     last_name: string;
  //     linked_to: number;
  //     login_status: number;
  //     user_email: string;
  //     user_id: number;
  //     user_password: string;
  //     user_role: string;
  //     user_telephone: string;
  //   } = JSON.parse(localStorage.getItem("user") as string);
  //   setUserRole(current_user.user_role);
  // }, []);

  return (
    <div className="main col-12">
      <div className="body d-flex flex-wrap">
        <h1 className="logo">Logo</h1>
        <SideBar navLinks={links} setNavLinks={setLinks} />

        <div className="col-md-10 d-flex flex-wrap justify-content-center height-auto">
          {!showUserForm ? (
            <Users setShowUserForm={setShowUserForm} />
          ) : (
            <UserForm
              showUserForm={showUserForm}
              setShowUserForm={setShowUserForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
