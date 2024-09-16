import React, { useState } from "react";
import "../styles/cashier-interface-style.css";
import CashierHeader from "../cashier-header";
import SideBar from "../side-bar";
import { NavLinkModule } from "../modules/nav-link-module";

interface Props {}

const ShopCashierReceipts: React.FC<Props> = () => {
  const [managerCreditBalance, setManagerCreditBalance] = useState<number>(0);

  const [navLinks, setNavLinks] = useState<NavLinkModule[]>([
    {
      lable: "Games",
      link: "/cashier-page",
    },
    {
      lable: "Receipts",
      link: "/shop-cashier-receipts",
      status: "active",
    },
    {
      lable: "Reports",
      link: "/shop-cashier-reports",
    },
    {
      lable: "Credit",
      link: "/credit-report",
    },
  ]);

  return (
    <div className="main">
      <CashierHeader
        managerCreditBalance={managerCreditBalance}
        setManagerCreditBalance={setManagerCreditBalance}
      />

      <div className="body col-12 d-flex flex-wrap">
        <SideBar navLinks={navLinks} setNavLinks={setNavLinks} />
      </div>
    </div>
  );
};

export default ShopCashierReceipts;
