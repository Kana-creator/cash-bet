import React, { useState, useEffect } from "react";
import TextField from "../form-fields/text-field";
import ButtonText from "../buttons/button-text";
import { Link } from "react-router-dom";
import { AdminSignupAction } from "../activities/admin-signup-action";
import { UserModule } from "../modules/user-module";
import { AxiosStatic } from "axios";
import { AppUrl } from "../activities/app-url";

interface Props {
  axios: AxiosStatic;
}

const AdminSignupForm: React.FC<Props> = ({ axios }) => {
  const [admin, setAdmin] = useState<UserModule>({
    linked_to: 1,
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    user_role: "Admin",
    dutyStation: 0,
    password: "",
    confirmPassword: "",
  });

  return (
    <div className="admin__signup__form col-md-12 col-sm-12 col-lg-8 col-xl-8 p-4">
      <h2>SignUp (Admin)</h2>
      <form
        action=""
        className="row"
        onSubmit={(e: React.FormEvent) => e.preventDefault()}
      >
        <TextField
          span="*"
          className="form-group py-4 col-md-6"
          label="First name"
          type="text"
          id="first-name"
          value=""
          autoFocus={true}
          placeholder="Enter first name here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAdmin({
              ...admin,
              firstName: e.target.value,
            })
          }
          onKeyUp={() => {}}
        />

        <TextField
          span="*"
          className="form-group py-4 col-md-6"
          label="Last name"
          type="text"
          id="last-name"
          value=""
          autoFocus={false}
          placeholder="Enter last name here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAdmin({ ...admin, lastName: e.target.value })
          }
          onKeyUp={() => {}}
        />

        <TextField
          span="*"
          className="form-group py-2 col-md-6"
          label="Email"
          type="email"
          id="email"
          value=""
          autoFocus={false}
          placeholder="Enter email (eg@example.domin) "
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAdmin({ ...admin, email: e.target.value })
          }
          onKeyUp={() => {}}
        />

        <TextField
          span="*"
          className="form-group py-2 col-md-6"
          label="Phone number"
          type="text"
          id="phone-number"
          value=""
          autoFocus={false}
          placeholder="Enter phone number here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAdmin({ ...admin, telephone: e.target.value })
          }
          onKeyUp={() => {}}
        />

        <TextField
          span="*"
          className="form-group py-2 col-md-6"
          label="Password"
          type="password"
          id="password"
          value=""
          autoFocus={false}
          placeholder="Enter password here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAdmin({ ...admin, password: e.target.value })
          }
          onKeyUp={() => {}}
        />

        <TextField
          span="*"
          className="form-group py-2 col-md-6"
          label="Confirm password"
          type="password"
          id="confirm-password"
          value=""
          autoFocus={false}
          placeholder="Enter password confirmation here..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAdmin({ ...admin, confirmPassword: e.target.value })
          }
          onKeyUp={() => {}}
        />

        <div className="col-12 my-4 py-4 d-flex justify-content-center">
          <ButtonText
            value="Signup"
            className="form-group my-4 px-4 col-md-4 col-sm-12"
            id="admin-signup-btn"
            action={(e: React.FormEvent) =>
              AdminSignupAction(
                e,
                [
                  document.getElementById("first-name") as HTMLInputElement,
                  document.getElementById("last-name") as HTMLInputElement,
                  document.getElementById("email") as HTMLInputElement,
                  document.getElementById("phone-number") as HTMLInputElement,
                  document.getElementById("password") as HTMLInputElement,
                  document.getElementById(
                    "confirm-password"
                  ) as HTMLInputElement,
                ],
                axios,
                admin
              )
            }
          />
        </div>

        <p>
          You have an admin accoount already?{" "}
          <Link to="/admin">Signin here</Link>
        </p>
      </form>
    </div>
  );
};

export default AdminSignupForm;
