import React, { useState } from "react";
import { GameModule } from "../modules/game-module";
import "../styles/manager-style.css";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";
import ManagerHeader from "../manager-header";
import Cashiers from "../cashiers";

const CashiersPage: React.FC = () => {
  const [showUserForm, setShowUserForm] = useState<boolean>(false);
  const [managerCreditBalance, setManagerCreditBalance] = useState<number>(0);

  const [navLinks, setNavLinks] = useState<NavLinkModule[]>([
    {
      lable: "Games",
      link: "/manager-page",
    },
    {
      lable: "Cashiers",
      link: "/cashiers-page",
      status: "active",
    },
  ]);

  return (
    <div className="main">
      <ManagerHeader
        managerCreditBalance={managerCreditBalance}
        setManagerCreditBalance={setManagerCreditBalance}
      />
      <div className="body col-12 d-flex flex-wrap">
        <SideBar navLinks={navLinks} setNavLinks={setNavLinks} />
        <div className="col-md-10 d-flex flex-wrap justify-content-center height-auto">
          <Cashiers
            showUserForm={showUserForm}
            setShowUserForm={setShowUserForm}
            setManagerCreditBalance={setManagerCreditBalance}
          />
        </div>
      </div>
    </div>
  );
};

export default CashiersPage;
