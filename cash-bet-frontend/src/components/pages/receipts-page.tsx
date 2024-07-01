import React, { useEffect, useState } from "react";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";
import ScreenPreloader from "../screen-preloader";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import ResultsTable from "../results-table";
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

const Receipts: React.FC = () => {
  const [links, setLinks] = useState<NavLinkModule[]>([
    {
      lable: "Dashbord",
      link: "/partner-dashboard",
      status: "",
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

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const currentUser: User = JSON.parse(
      localStorage.getItem("user") as string
    );

    setCurrentUserId(currentUser.user_id);
    setCurrentUserName(currentUser.first_name);
    setCurrentUserRole(currentUser.user_role);
  }, []);

  useEffect(() => setLoading(false), []);

  // const refreshGameIDs = () => {
  //   return (window.location.href = "/partiner-results");
  // };

  return loading ? (
    <div className="main d-flex justify-content-center align-items-center">
      <ScreenPreloader />
    </div>
  ) : (
    <div className="main col-12">
      <div className="body d-flex flex-wrap">
        <h1 className="logo">BETCRANE</h1>
        <SideBar navLinks={links} setNavLinks={setLinks} />
        <div className="col-md-10 px-4">
          <ReceiptsTable
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            currentUserRole={currentUserRole}
          />
        </div>
      </div>
    </div>
  );
};

export default Receipts;
