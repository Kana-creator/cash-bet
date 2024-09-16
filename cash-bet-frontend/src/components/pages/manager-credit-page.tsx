import React, { useEffect, useState } from "react";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";
import axios from "axios";
import { AppUrl } from "../activities/app-url";
import { AdminRightsModule } from "../modules/admin-rights-module";
import CreditTable from "../credit-table";

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

interface Props {}

const ManagerCreditReportPage: React.FC<Props> = () => {
  const [links, setLinks] = useState<NavLinkModule[]>([]);

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

        setLinks([
          {
            lable: "Games",
            link: "/manager-page",
          },
          {
            lable: "Cashiers",
            link: "/cashiers-page",
          },
          {
            lable: "Credit",
            link: "/manager-credit-report",
            status: "active",
          },
        ]);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="main col-12">
      <div className="body d-flex flex-wrap">
        <h1 className="logo">
          BETCRANE
          {/* <img
            src="images/logos/XMA-LOGO.jpeg"
            alt="no img"
            width={150}
            height={100}
          /> */}
        </h1>
        <SideBar navLinks={links} setNavLinks={setLinks} />
        <div className="col-md-10 d-flex flex-wrap justify-content-center height-auto">
          <CreditTable
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            currentUserRole={currentUserRole}
            // exportToExcel={exportToExcel}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerCreditReportPage;
