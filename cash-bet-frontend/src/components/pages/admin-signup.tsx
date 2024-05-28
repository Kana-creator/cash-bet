import React from "react";
import AdminSignupForm from "../forms/admin-signup-form";
import { AxiosStatic } from "axios";

interface Props {
  axios: AxiosStatic;
}

const AdminSignup: React.FC<Props> = ({ axios }) => {
  return (
    <div className="main container-fluid d-flex align-items-center justify-content-center min-vh-100">
      <AdminSignupForm axios={axios} />
    </div>
  );
};

export default AdminSignup;
