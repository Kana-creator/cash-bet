import React, { useEffect, useState } from "react";
import TextField from "../form-fields/text-field";
import ButtonText from "../buttons/button-text";
import { Link } from "react-router-dom";
import { SigninAction } from "../activities/signin-action";
import { AxiosStatic } from "axios";
import { AppUrl } from "../activities/app-url";

interface Props {
  axios: AxiosStatic;
}

const AdminSigninForm: React.FC<Props> = ({ axios }) => {
  const [adminStatus, setAdminStatus] = useState<boolean>(false);
  const [userData, setUserData] = useState<{
    userName: string;
    userPassword: string;
  }>({
    userName: "",
    userPassword: "",
  });

  useEffect(() => {
    axios
      .get(`${AppUrl()}/adminStatus`)
      .then((res) =>
        res.data.status === "success"
          ? setAdminStatus(true)
          : setAdminStatus(false)
      )
      .catch((error) => console.log(error));
  });
  return (
    <div className="signin__form col-md-6 col-sm-12 col-lg-4 col-xl-4 p-4">
      <h2>SignIn (Admin)</h2>
      <form onSubmit={(e: React.FormEvent) => e.preventDefault()}>
        <TextField
          span="*"
          className="form-group my-4 px-4 "
          label="Username"
          type="text"
          id="username"
          value=""
          autoFocus={true}
          placeholder="Enter username here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUserData({ ...userData, userName: e.target.value })
          }
          onKeyUp={() => {}}
        />
        <TextField
          span="*"
          className="form-group my-4 px-4 "
          label="Password"
          type="password"
          id="password"
          value=""
          autoFocus={false}
          placeholder="Enter password here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUserData({ ...userData, userPassword: e.target.value })
          }
          onKeyUp={() => {}}
        />

        <ButtonText
          value="Signin"
          className="form-group my-4 px-4"
          id="signin__button"
          action={() => {
            SigninAction(
              [
                document.getElementById("username") as HTMLInputElement,
                document.getElementById("password") as HTMLInputElement,
              ],
              userData,
              "/admin-page"
            );
          }}
        />

        {adminStatus ? (
          <div className="col-12 container">
            <p>
              No admin account? <Link to="/admin-signup">Create account</Link>
            </p>
          </div>
        ) : (
          ""
        )}
      </form>
    </div>
  );
};

export default AdminSigninForm;
