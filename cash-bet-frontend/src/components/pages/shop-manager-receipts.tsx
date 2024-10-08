import React, { useState } from "react";
import "../styles/manager-style.css";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";
import ManagerHeader from "../manager-header";

const ShopManagerReceipts: React.FC = () => {
  const [managerCreditBalance, setManagerCreditBalance] = useState<number>(0);

  const [navLinks, setNavLinks] = useState<NavLinkModule[]>([
    {
      lable: "Games",
      link: "/manager-page",
    },
    {
      lable: "Cashiers",
      link: "/cashiers-page",
    },
    {
      lable: "Receipts",
      link: "/shop-manager-receipts",
      status: "active",
    },
    {
      lable: "Reports",
      link: "/shop-manager-reports",
    },
    {
      lable: "Credit",
      link: "/credit-report",
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
        <div className="col-md-10 d-flex flex-wrap justify-content-center height-auto"></div>
      </div>
    </div>
  );
};

export default ShopManagerReceipts;
