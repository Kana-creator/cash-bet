const FetchAllAdminStaff = (
  res,
  dbConn,
  user_id,
  linked_to,
  user_role,
  view_dashboard
) => {
  if (user_role !== "Admin" && view_dashboard !== "1") {
    return res.json({ message: "Your are not allowed to view admin data!" });
  } else {
    const query =
      "SELECT COUNT(user_id) AS allAdminStaff FROM user WHERE (user_role!=? AND linked_to=?) OR (user_role=? AND linked_to=?) OR user_role=?";

    dbConn.query(
      query,
      ["partner", user_id, "partner", linked_to, "Admin"],
      (error, result) => {
        if (error) {
          return res.json({ message: error.sqlMessage, status: "error" });
        } else {
          return res.json({
            allAdminStaff: result[0].allAdminStaff,
            status: "success",
          });
        }
      }
    );
  }
};

export default FetchAllAdminStaff;
