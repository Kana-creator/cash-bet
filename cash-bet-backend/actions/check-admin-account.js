const CheckAdminAccount = (res, dbConn) => {
  const query = "SELECT user_id FROM user WHERE user_role=?";
  dbConn.query(query, ["Admin"], (error, results) => {
    if (error) {
      return res
        .status(201)
        .json({ message: error.sqlMessage, status: "error" });
    } else if (results.length > 0) {
      return res
        .status(201)
        .json({ message: "Admin exists already!", status: "error" });
    } else {
      return res.status(200).json({ message: "No admin!", status: "success" });
    }
  });
};

export default CheckAdminAccount;
