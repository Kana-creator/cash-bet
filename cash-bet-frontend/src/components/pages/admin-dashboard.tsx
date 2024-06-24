import React, { memo, useEffect, useState } from "react";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";
import { MdDashboard } from "react-icons/md";
import AdminDashboardComponent from "../admin-dashboard";
import { AdminRightsModule } from "../modules/admin-rights-module";
import axios from "axios";
import { AppUrl } from "../activities/app-url";

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
  setAdminRights: React.Dispatch<React.SetStateAction<AdminRightsModule[]>>;
}

const AdminDashboard: React.FC<Props> = memo(
  ({ adminRights, setAdminRights }) => {
    const [links, setLinks] = useState<NavLinkModule[]>([]);

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
          setAdminRights([...res.data.adminRights]);

          setLinks([
            {
              lable: "Dashbord",
              link: "/admin-dashboard",
              status: "active",
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
              view: res.data.adminRights[0].view_users,
            },

            {
              lable: "Reports",
              link: "/admin-reports",
              view: res.data.adminRights[0].view_reports,
            },
          ]);
        })
        .catch((error) => console.log(error));

      // FETCH ALL SYSTME USERS
      axios
        .get(
          `${AppUrl()}/fetch-all-system-users/${currentUser.user_role}/${
            currentUser.user_id
          }`,
          {
            headers: { "x-access-token": userToken },
          }
        )
        .then((res) => {
          if (res.data.status === "success") {
            setAllSystemUsers(res.data.allSystemUsers);
          } else {
            window.alert(res.data.message);
          }
        })
        .catch((error) => console.log(error));

      // FETCH ALL SYSTEM PARTNERS
      axios
        .get(
          `${AppUrl()}/fetch-all-system-partners/${currentUser.user_role}/${
            adminRights[0].view_dashboard
          }`,
          {
            headers: { "x-access-token": userToken },
          }
        )
        .then((res) => {
          if (res.data.status === "success") {
            setAllPartners(res.data.allPartners);
          } else {
            window.alert(res.data.message);
          }
        })
        .catch((error) => console.log(error));

      // FETCH ALL ADMIN STAFF
      axios
        .get(
          `${AppUrl()}/fetch-all-admin-staff/${currentUser.user_id}/${
            currentUser.linked_to
          }/${currentUser.user_role}/${adminRights[0].view_dashboard}`,
          {
            headers: { "x-access-token": userToken },
          }
        )
        .then((res) => {
          if (res.data.status === "success") {
            setAllAdminStaff(res.data.allAdminStaff);
          } else {
            window.alert(res.data.message);
          }
        })
        .catch((error) => console.log(error));
    }, []);

    // FETCH NUMBER OF USERS BY CATEGORY
    useEffect(() => {
      const currentUser: User = JSON.parse(
        localStorage.getItem("user") as string
      );
      const userToken = localStorage.getItem("token");

      axios
        .get(
          `${AppUrl()}/fetch-all-users-by-category/${currentUser.user_role}/${
            adminRights[0].view_dashboard
          }`,
          { headers: { "x-access-token": userToken } }
        )
        .then((res) => {
          setUsersByCategory([
            ...res.data.usersByCategory.map(
              (
                users: {
                  number_of_users: number;
                  user_role: string;
                  fill?: string;
                },
                index: number
              ) => {
                return {
                  value: users.number_of_users,
                  name: users.user_role,
                  fill: `#${index}a${users.number_of_users}d4b2`.slice(0, 5),
                };
              }
            ),
          ]);
        });
    }, []);

    return (
      <div className="main col-12">
        <div className="body d-flex flex-wrap">
          <h1 className="logo">LOGO</h1>
          <SideBar navLinks={links} setNavLinks={setLinks} />
          <div className="col-md-10 d-flex flex-wrap justify-content-center height-auto">
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
  }
);

export default AdminDashboard;
