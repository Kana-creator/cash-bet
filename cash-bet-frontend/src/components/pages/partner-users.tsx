import React, { useState } from "react";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";
import { MdDashboard } from "react-icons/md";
import UserForm from "../forms/user-form";
import Users from "../users";
import "../styles/user-page-style.css";

const PartnerUsers: React.FC = () => {
  const [showUserForm, setShowUserForm] = useState<boolean>(false);
  const [links, setLinks] = useState<NavLinkModule[]>([
    {
      lable: "Dashbord",
      link: "/partner-dashboard",
      icon: MdDashboard,
    },

    {
      lable: "Users",
      link: "/partner-users",
      status: "active",
    },
    {
      lable: "Shops",
      link: "/partner-shops",
    },

    {
      lable: "Fixture",
      link: "/fixture",
    },
    {
      lable: "Results",
      link: "/partiner-results",
    },

    {
      lable: "Reports",
      link: "/partner-receipts",
    },
  ]);
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

export default PartnerUsers;
