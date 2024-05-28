import React from "react";
import { NavLinkModule } from "./modules/nav-link-module";
import { useNavigate } from "react-router-dom";

interface Props {
  navLinkModule: NavLinkModule;
}

const NavLinkItem: React.FC<Props> = ({ navLinkModule }) => {
  const navigate = useNavigate();
  return (
    <li
      className={`link col-12 fs-6 ${navLinkModule.status}`}
      onClick={() => {
        navigate(`${navLinkModule.link}`);
        // window.location.reload();
      }}
      style={{ display: `${navLinkModule.view === 0 ? "none" : "block"}` }}
    >
      {navLinkModule.lable}
    </li>
  );
};

export default NavLinkItem;
