import React, { useEffect, useState } from "react";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";
import { MdDashboard } from "react-icons/md";
import PartnerDashboardComponent from "../partner-dashboard";
import AdminDashboardComponent from "../admin-dashboard";
import { AdminRightsModule } from "../modules/admin-rights-module";

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

interface Props {
  adminRights: AdminRightsModule[];
}

const PartnerDashboard: React.FC<Props> = ({ adminRights }) => {
  const [links, setLinks] = useState<NavLinkModule[]>([
    {
      lable: "Dashbord",
      link: "/partner-dashboard",
      icon: MdDashboard,
      status: "active",
    },

    {
      lable: "Users",
      link: "/partner-users",
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

  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  const [allSystemUsers, setAllSystemUsers] = useState<number>(0);
  const [allPartners, setAllPartners] = useState<number>(0);
  const [allAdminStaff, setAllAdminStaff] = useState<number>(0);
  const [usersRegRate, setUsersRegRate] = useState<
    {
      value: number;
      name: string;
      fill?: string;
    }[]
  >([]);

  const [usersByCategory, setUsersByCategory] = useState<
    {
      value: number;
      name: string;
      // fill?: string;
    }[]
  >([]);

  useEffect(() => {
    const currentUser: User = JSON.parse(
      localStorage.getItem("user") as string
    );

    setCurrentUserId(currentUser.user_id);
    setCurrentUserName(currentUser.first_name);
    setCurrentUserRole(currentUser.user_role);
  }, []);

  return (
    <div className="main col-12">
      <div className="body d-flex flex-wrap">
        <h1 className="logo">Logo</h1>
        <SideBar navLinks={links} setNavLinks={setLinks} />
        <div className="col-md-10 d-flex flex-wrap justify-content-center height-auto">
          {/* <PartnerDashboardComponent
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            currentUserRole={currentUserRole}
          /> */}
          <AdminDashboardComponent
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            currentUserRole={currentUserRole}
            allSystemUsers={allSystemUsers}
            allPartners={allPartners}
            allAdminStaff={allAdminStaff}
            usersRegRate={usersRegRate}
            usersByCategory={usersByCategory}
            adminRights={adminRights}
          />
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
