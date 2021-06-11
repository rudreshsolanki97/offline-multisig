import React from "react";
import { Navbar } from "react-bootstrap";

import WalletLoader from "./WalletLoader";

import XdcIcon from "../assets/img/xdc-favicon/android-icon-36x36.png";

function Header() {
  return (
    <Navbar className="custom-header" bg="light" expand="lg">
      <div className="navbar-brand">
        <img src={XdcIcon} alt="XDC Logo" />
        XDC Multi-Sig
      </div>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>

      <div className="ml-auto header-btn">
        <WalletLoader />
      </div>
    </Navbar>
  );
}

export default Header;
