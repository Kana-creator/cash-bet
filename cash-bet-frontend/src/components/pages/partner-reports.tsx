import React, { useEffect, useState } from "react";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";
import { MdDashboard } from "react-icons/md";
// import PartnerDashboardComponent from "../partner-dashboard";
import PartnerReportsComponent from "../partner-reports-component";
import ReceiptsTable from "../receipts-table";

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

const PartnerReports: React.FC = () => {
  const [links, setLinks] = useState<NavLinkModule[]>([
    {
      lable: "Dashbord",
      link: "/partner-dashboard",
      icon: MdDashboard,
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
      status: "active",
    },
  ]);

  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
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
        <div className="col-md-10 px-4">
          <ReceiptsTable
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            currentUserRole={currentUserRole}
            // exportToExcel={exportToExcel}
          />
          {/* <h1>Anatoli Kuwebwa</h1> */}
        </div>
      </div>
    </div>
  );
};

export default PartnerReports;
