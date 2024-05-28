import React, { useEffect, useState } from "react";
import SigninForm from "../forms/signin-form";
import ScreenPreloader from "../screen-preloader";

const Signin: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => setLoading(false), []);

  return (
    <div className="main container-fluid d-flex flex-wrap align-items-center justify-content-center min-vh-100">
      {loading ? <ScreenPreloader /> : <SigninForm />}
    </div>
  );
};

export default Signin;
