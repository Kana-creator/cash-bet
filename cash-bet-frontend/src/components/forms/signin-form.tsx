import React, { useEffect, useState } from "react";
import TextField from "../form-fields/text-field";
import ButtonText from "../buttons/button-text";
import { SigninAction } from "../activities/signin-action";

const SigninForm: React.FC = () => {
  const [userData, setUserData] = useState<{
    userName: string;
    userPassword: string;
  }>({ userName: "", userPassword: "" });

  return (
    <div className="signin__form col-md-6 col-sm-12 col-lg-4 col-xl-4 p-4">
      <h2>SignIn</h2>
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
          placeholder="Eneter password here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUserData({ ...userData, userPassword: e.target.value })
          }
          onKeyUp={() => {}}
        />

        <ButtonText
          value="SignIn"
          className="form-group my-4 px-4"
          id="signin__button"
          action={() => {
            SigninAction(
              [
                document.getElementById("username") as HTMLInputElement,
                document.getElementById("password") as HTMLInputElement,
              ],
              userData,
              "/cashier-page"
            );
          }}
        />
      </form>
    </div>
  );
};

export default SigninForm;
