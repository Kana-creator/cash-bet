import React, { useState, useEffect } from "react";
import { AppUrl } from "./activities/app-url";
import axios from "axios";
import { MdSettings } from "react-icons/md";
import { UserLogOut } from "./activities/signout-action";
import { Credit } from "./modules/credit-module";
import AdminUser from "./admin-user";
import { AdminRightsModule } from "./modules/admin-rights-module";

interface Props {
  showUserForm: boolean;
  setShowUserForm: React.Dispatch<React.SetStateAction<boolean>>;
  setAdminRights: React.Dispatch<React.SetStateAction<AdminRightsModule>>;
  currentUserAdminRights: AdminRightsModule[];
}

interface User {
  block_status: number;
  date_added: string;
  date_updated: string;
  duty_station: string;
  first_name: string;
  last_name: string;
  linked_to: number;
  login_status: number;
  max_payout: number;
  max_stake: number;
  min_stake: number;
  operator: number;
  sales_limit: number;
  shop_id: number;
  shop_location: string;
  shop_name: string;
  user_email: string;
  user_id: number;
  user_password: string;
  user_role: string;
  user_telephone: string;
}

const AdminUsers: React.FC<Props> = ({
  showUserForm,
  setShowUserForm,
  setAdminRights,
  currentUserAdminRights,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [searchField, setSearchField] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [usersLength, setUsersLength] = useState<number>(0);
  const [userToken, setUserToken] = useState<string>("");
  const [creditStatus, setCreditStatus] = useState<boolean>(false);

  // const [credit, setCredit] = useState<Credit>({
  //   given_by: 0,
  //   given_to: 0,
  //   credit_amount: 0,
  //   credit_type: "",
  // });

  useEffect(() => {
    const currentUser: User = JSON.parse(
      localStorage.getItem("user") as string
    );

    setCurrentUserRole(currentUser.user_role);
    setCurrentUserName(currentUser.first_name);
    setCurrentUserId(currentUser.user_id);

    const user_id: number = currentUser.user_id;
    const token: string = localStorage.getItem("token") as string;

    setUserToken(token);
    // setCredit({ ...credit, given_by: user_id });

    axios
      .get(
        `${AppUrl()}/fetchUsers/${user_id}/${currentUser.user_role}/${
          currentUser.linked_to
        }`,
        {
          headers: { "x-access-token": token },
        }
      )
      .then((res) => {
        if (res.data.status === "error") {
          setErrorMessage(res.data.message);
        } else {
          setUsers([...res.data.users]);
          setUsersLength(res.data.users.length);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSearch = (search_value: HTMLInputElement) => {
    setSearchField(search_value.value);

    const newUsers = users.filter((u) =>
      // s.shop_name.toLowerCase().includes(search_value.value) ||
      JSON.stringify(u.user_id).includes(search_value.value.slice(3))
    );

    if (search_value.value !== "") {
      setSearchResults(newUsers);
      setUsersLength(newUsers.length);
    } else {
      setUsersLength(users.length);
      setSearchResults([]);
    }
  };

  const handleDelete = (user_id: number) => {
    const confirm_delete = window.confirm(
      "Are you sure you want to delete this user ?"
    );

    if (confirm_delete) {
      axios
        .get(`${AppUrl()}/delete-user/${user_id}`, {
          headers: { "x-access-token": userToken },
        })
        .then((res) => {
          if (res.data.status === "success") {
            const newUsers = users.filter((u) => u.user_id !== user_id);
            setUsers(newUsers);
            setUsersLength(newUsers.length);
            setSearchField("");
            window.alert(res.data.message);
          } else {
            window.alert(res.data.message);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="users col-12 d-flex flex-wrap justify-content-center">
      <div className="page-heading col-10 d-flex justify-content-around mb-4 p-4">
        <h4>Users</h4>
        <span
          className="d-flex align-items-center"
          style={{ height: "fit-content" }}
        >
          <span className="px-4 fs-4 bg-light text-danger">{usersLength}</span>
          <span
            className="btn btn-secondary"
            onClick={() => setShowUserForm(true)}
            style={{
              display: `${
                currentUserAdminRights[0].add_user === 0 ? "none" : "block"
              }`,
            }}
          >
            Add user
          </span>{" "}
        </span>
        <form action="" className="col-4">
          <input
            type="search"
            name=""
            id="search-user"
            className="form-control col-12"
            placeholder="Search for a user.."
            defaultValue={searchField}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSearch(e.target)
            }
          />
        </form>
        <details
          className="position-relative  bg-dark px-3 py-1"
          style={{ width: "fit-content" }}
        >
          <summary>
            <span>
              {currentUserName} {<MdSettings />}
            </span>
          </summary>
          <p className="btn btn-secondary px-2 py-2 col-12 mt-3">Profile</p>
          <p
            className="btn btn-secondary px-2 py-2 col-12"
            onClick={() => UserLogOut(currentUserRole, currentUserId)}
          >
            Logout
          </p>
        </details>
      </div>
      {searchField.length === 0 ? (
        users.length !== 0 ? (
          <div
            className="pt-5 mt-5 col-12 d-flex flex-wrap justify-content-center"
            style={{ height: "fit-content" }}
          >
            {users.map((user, index) => (
              <AdminUser
                key={index}
                userData={user}
                handleDelete={handleDelete}
                setShowUserForm={setShowUserForm}
                setAdminRights={setAdminRights}
                currentUserAdminRights={currentUserAdminRights}
              />
            ))}
          </div>
        ) : (
          <div className="pt-5 col-12 d-flex flex-wrap justify-content-center align-items-center">
            <h1 className="text-danger">{errorMessage}</h1>
          </div>
        )
      ) : searchResults.length !== 0 ? (
        <div
          className="pt-5 mt-5 col-12 d-flex flex-wrap justify-content-center"
          style={{ height: "fit-content" }}
        >
          {searchResults.map((user, index) => (
            <AdminUser
              key={index}
              userData={user}
              handleDelete={handleDelete}
              setShowUserForm={setShowUserForm}
              setAdminRights={setAdminRights}
              currentUserAdminRights={currentUserAdminRights}
              // setCreditStatus={setCreditStatus}
              // setCredit={setCredit}
              // credit={credit}
            />
          ))}
        </div>
      ) : (
        <div className="pt-5 col-12 d-flex flex-wrap justify-content-center align-items-center">
          <h1 className="text-danger">No User Found!</h1>
        </div>
      )}

      {/* <div
        className={`col-12 p-4 credit-action-div ${
          creditStatus ? "active" : ""
        }`}
      >
        <span
          className="btn btn-danger close-credit-div"
          onClick={() => {
            setCreditStatus(false);
            // setCredit({
            //   given_by: 0,
            //   given_to: 0,
            //   credit_amount: 0,
            //   credit_type: "",
            //   user_name: "",
            // });
          }}
        >
          X
        </span>

        <div className="col-4 p-4 alert alert-info">
          {credit.credit_type === "plus" ? (
            <h4 className="my-3">Add credit to {credit.user_name}</h4>
          ) : (
            <h4 className="my-3">Reduce credit from {credit.user_name}</h4>
          )}

          <input
            type="number"
            className="col-12 form-control fs-5"
            placeholder="Enter credit amount here..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCredit({ ...credit, credit_amount: parseInt(e.target.value) })
            }
          />
          <div className="d-flex col-12 justify-content-center">
            <span className="btn btn-primary my-4 mx-2 fs-5">Submit</span>
            <span
              className="btn btn-secondary my-4 mx-2 fs-5"
              onClick={() => {
                setCreditStatus(false);
                setCredit({
                  given_by: 0,
                  given_to: 0,
                  credit_amount: 0,
                  credit_type: "",
                  user_name: "",
                });
              }}
            >
              cancel
            </span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AdminUsers;
