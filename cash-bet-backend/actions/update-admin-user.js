const UpdateAdminUser = (req, res, dbConn, user_id) => {
  const query =
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
      if (error) {
        return res
          .status(200)
          .json({ message: error.sqlMessage, status: "error" });
      } else {
        const values = [
          user_id,
          req.body.view_dashboard,
          req.body.view_partners,
          req.body.add_partner,
          req.body.add_credit,
          req.body.block_partner,
          req.body.delete_partner,
          req.body.view_users,
          req.body.add_user,
          req.body.edit_user,
          req.body.delete_user,
          req.body.view_reports,
        ];
        const query = "SELECT user_id FROM admin_rights WHERE user_id=?";

        dbConn.query(query, [user_id], (error, results) => {
          if (error) {
            return res.json({ message: error.sqlMessage, status: "error" });
          } else if (results.length === 0) {
            const query =
              "INSERT INTO admin_rights(user_id, view_dashboard, view_partners, add_partner, add_credit, block_partner, delete_partner, view_users, add_user, edit_user, delete_user, view_reports) VALUES(?)";
            dbConn.query(query, [values], (error) => {
              if (error) {
                return res.json({
                  message: error.sqlMessage,
                  status: "error",
                });
              } else {
                return res.json({
                  message: "User has been updated successfully!",
                  status: "success",
                });
              }
            });
          } else {
            const query =
              "UPDATE admin_rights SET view_dashboard=?, view_partners=?, add_partner=?, add_credit=?,block_partner=?, delete_partner=?, view_users=?, add_user=?, edit_user=?, delete_user=?, view_reports=? WHERE user_id=?";

            dbConn.query(
              query,
              [
                req.body.view_dashboard,
                req.body.view_partners,
                req.body.add_partner,
                req.body.add_credit,
                req.body.block_partner,
                req.body.delete_partner,
                req.body.view_users,
                req.body.add_user,
                req.body.edit_user,
                req.body.delete_user,
                req.body.view_reports,
                user_id,
              ],
              (error) => {
                if (error) {
                  return res.json({
                    message: error.sqlMessage,
                    status: "error",
                  });
                } else {
                  return res.json({
                    message: "User has been updated successfully!",
                    status: "success",
                  });
                }
              }
            );
          }
        });
      }
    }
  );
};

export default UpdateAdminUser;
