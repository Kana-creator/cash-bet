import React, { useEffect, useState } from "react";
import AdminSigninForm from "../forms/admin-signin-form";
import { AxiosStatic } from "axios";
import ScreenPreloader from "../screen-preloader";

interface Props {
  axios: AxiosStatic;
}

const AdminSignin: React.FC<Props> = ({ axios }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => setLoading(false), []);

  return (
    <div className="main container-fluid d-flex align-items-center justify-content-center">
      {loading ? <ScreenPreloader /> : <AdminSigninForm axios={axios} />}
    </div>
  );
};

export default AdminSignin;
