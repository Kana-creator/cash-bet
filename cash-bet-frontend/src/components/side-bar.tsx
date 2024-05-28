import React, { useEffect, useState } from "react";
import { NavLinkModule } from "./modules/nav-link-module";
import NavLinkItem from "./nav-link";
import { FormatMoney } from "./activities/format-money";
import axios from "axios";
import { AppUrl } from "./activities/app-url";

interface Props {
  navLinks: NavLinkModule[];
  setNavLinks: React.Dispatch<React.SetStateAction<NavLinkModule[]>>;
}

interface User {
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

const SideBar: React.FC<Props> = ({ navLinks, setNavLinks }) => {
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  useEffect(() => {
    const user = localStorage.getItem("user") as string;
    const current_user: User = JSON.parse(user);
    setCurrentUserRole(current_user.user_role);

    const userToken: string = localStorage.getItem("token") as string;

    const interval = setInterval(() => {
      axios
        .get(`${AppUrl()}/fetch-credit-balance/${current_user.user_id}`, {
          headers: { "x-access-token": userToken },
        })
        .then((res) => {
          if (res.data.status === "success") {
            setCreditBalance(res.data.credit_balance.available_credit);
          } else {
            window.alert(res.data.message);
          }
        })
        .catch((error) => console.log(error));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="col-md-2  side-bar">
      <ul className="links">
        {currentUserRole === "partner" ? (
          <h5 className="my-4 col-12 text-center text-warning">
            {FormatMoney(creditBalance, 2)}
          </h5>
        ) : currentUserRole === "internal partner" ? (
          <h5 className="my-4 col-12 text-center text-warning">
            {FormatMoney(creditBalance, 2)}
          </h5>
        ) : (
          ""
        )}
        <div className="li">
          {navLinks.map((navLink, index) => (
            <NavLinkItem key={index} navLinkModule={navLink} />
          ))}
        </div>
      </ul>
    </div>
  );
};

export default SideBar;
