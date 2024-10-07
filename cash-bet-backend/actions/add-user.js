import bcryptjs from "bcryptjs";

const AddUser = async (req, res, dbConn) => {
  console.log(req.body.user_role);

  const sallt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(req.body.password, sallt);

  const values = [
    req.body.linked_to,
    req.body.firstName,
    req.body.lastName,
    req.body.email,
    req.body.telephone,
    req.body.user_role,
    req.body.dutyStation,
    req.body.company_name,
    hashedPassword,
    new Date(),
  ];

  // CHECK FOR DUPLICATE USERS
  const query = "SELECT * FROM user WHERE user_telephone=? OR user_email=?";

  dbConn.query(
    query,
    [req.body.telephone, req.body.email],
    (error, results) => {
      if (error) {
        return res.status(201).json({ message: error.sqlMessage });
      } else if (results.length > 0) {
        return res.status(201).json({
          message: "User with the same phone number or email already added!",
          status: "error",
        });
      } else {
        if (req.body.user_role === "manager") {
          const query = "SELECT manager_id FROM shop WHERE shop_id=?";
          dbConn.query(query, [req.body.dutyStation], (error, results) => {
            if (error) {
              return res
                .status(201)
                .json({ message: error.sqlMessage, status: "error" });
            }
            // else if (results[0].manager_id !== 0) {
            //   return res.status(201).json({
            //     message:
            //       "The shop you are choosing as duty station already has a manager. Please chose a different shop!",
            //     status: "error",
            //   });
            // }
            else {
              const query =
                "INSERT INTO user(linked_to, first_name, last_name, user_email, user_telephone, user_role, duty_station, company_name, user_password, date_added) VALUES(?)";

              dbConn.query(query, [values], (error) => {
                if (error) {
                  return res
                    .status(201)
                    .json({ message: error.sqlMessage, status: "error" });
                } else {
                  if (req.body.user_role === "manager") {
                    const query =
                      "SELECT user_id FROM user WHERE user_telephone=?";
                    dbConn.query(
                      query,
                      [req.body.telephone],
                      (error, results) => {
                        if (error) {
                          return res.status(201).json({
                            message: error.sqlMessage,
                            status: "error",
                          });
                        } else {
                          const query =
                            "UPDATE shop SET manager_id = ? WHERE shop_id = ?";
                          dbConn.query(
                            query,
                            [results[0].user_id, req.body.dutyStation],
                            (error) => {
                              if (error) {
                                return res.status(201).json({
                                  message: error.sqlMessage,
                                  status: "error",
                                });
                              } else {
                                return res.status(200).json({
                                  message: "User account created successfully.",
                                  status: "success",
                                });
                              }
                            }
                          );
                        }
                      }
                    );
                  } else {
                    return res.status(200).json({
                      message: "User account created successfully.",
                      status: "success",
                    });
                  }
                }
              });
            }
          });
        } else {
          const query =
            "INSERT INTO user(linked_to, first_name, last_name, user_email, user_telephone, user_role, duty_station, company_name, user_password, date_added) VALUES(?)";

          dbConn.query(query, [values], (error) => {
            if (error) {
              return res
                .status(201)
                .json({ message: error.sqlMessage, status: "error" });
            } else {
              if (req.body.user_role === "manager") {
                const query = "SELECT user_id FROM user WHERE user_telephone=?";
                dbConn.query(query, [req.body.telephone], (error, results) => {
                  if (error) {
                    console.log(error);
                    return res
                      .status(201)
                      .json({ message: error.sqlMessage, status: "error" });
                  } else {
                    console.log("results[0].user_id");
                    const query =
                      "UPDATE shop SET manager_id = ? WHERE shop_id = ?";
                    dbConn.query(
                      query,
                      [results[0].user_id, req.body.dutyStation],
                      (error) => {
                        if (error) {
                          return res.status(201).json({
                            message: error.sqlMessage,
                            status: "error",
                          });
                        } else {
                          return res.status(200).json({
                            message: "User account created successfully.",
                            status: "success",
                          });
                        }
                      }
                    );
                  }
                });
              } else {
                return res.status(200).json({
                  message: "User account created successfully.",
                  status: "success",
                });
              }
            }
          });
        }
      }
    }
  );
};

export default AddUser;
