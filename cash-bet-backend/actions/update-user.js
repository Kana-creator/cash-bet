const UpdateUser = (req, res, dbConn, user_id) => {
  // RESET MANAGER ID FOR THE SHOP WHICH HAS MANAGER ID SIMILAR TO THE PROVIDED USER ID.
  let query = "UPDATE shop SET manager_id=? WHERE manager_id=?";
  dbConn.query(query, [0, user_id], (error) => {
    if (error) {
      console.log(error.sqlMessage);
    } else {
      // RESET DUTY STATION FOR THE USER WITH DUTY STATION SIMILAR TO THE PROVIDED DUTY STATION
      query = "UPDATE user SET duty_station=? WHERE user_id=?";
      dbConn.query(query, [0, user_id], (error) => {
        if (error) {
          console.log(error.sqlMessage);
        } else {
          query =
            "UPDATE user SET user_role=?, duty_station=?, first_name=?, last_name=?, user_email=?, user_telephone=?, date_updated=? WHERE user_id=?";
          dbConn.query(
            query,
            [
              req.body.user_role,
              req.body.dutyStation,
              req.body.firstName,
              req.body.lastName,
              req.body.email,
              req.body.telephone,
              new Date(),
              user_id,
            ],
            (error) => {
              // check for sql query errors
              if (error) {
                // return an error message if any error was found
                return res
                  .status(200)
                  .json({ message: error.sqlMessage, status: "error" });
              } else {
                /* if the updated user is a manager, set the manager id for the duty station to be the user id of the updated user.*/

                if (req.body.user_role === "manager") {
                  //check if no other shop has the same manager

                  query = "SELECT COUNT(shop_id) AS number_of_shops FROM shop";

                  query = "UPDATE shop SET manager_id=? WHERE shop_id=?";
                  dbConn.query(
                    query,
                    [user_id, req.body.dutyStation],
                    (error) => {
                      // Check for sql query error
                      if (error) {
                        console.log(error.sqlMessage);
                      } else {
                        // return success message and status if no error and update use successful.
                        return res.status(200).json({
                          message: "User has been updated successfully!",
                          status: "success",
                        });
                      }
                    }
                  );
                } else {
                  // return success message if the update was successful.
                  return res.status(200).json({
                    message: "User has been updated successfully!",
                    status: "success",
                  });
                }
              }
            }
          );
        }
      });
    }
  });
};

export default UpdateUser;
