const FetchReceiptsCachiers = (req, res, dbConn) => {
  const { user_id, user_role } = req.params;

  if (user_role === "Admin" || user_role === "other admin") {
    const query = "SELECT user_id FROM user WHERE user_role=?";

    dbConn.query(query, ["internal partner"], (error, results) => {
      if (error) {
        console.log(error.sqlMessage);
      } else {
        const created_by = results[0].user_id;

        const query =
          "SELECT user_id, first_name, last_name FROM user WHERE linked_to=? AND (user_role=? OR user_role=?)";

        dbConn.query(
          query,
          [created_by, "cashier", "manager"],
          (error, results) => {
            if (error) {
              console.log(error.sqlMessage);
            } else {
              return res.json({ cashiers: results, status: "success" });
            }
          }
        );
      }
    });
  } else {
    const query =
      "SELECT user_id, first_name, last_name FROM user WHERE linked_to=? AND (user_role=? OR user_role=?)";

    dbConn.query(query, [user_id, "cashier", "manager"], (error, results) => {
      if (error) {
        console.log(error.sqlMessage);
      } else {
        return res.json({ cashiers: results, status: "success" });
      }
    });
  }

  // const query =
  //   "SELECT user_id, first_name, last_name FROM user WHERE linked_to=? AND (user_role=? OR user_role=?)";

  // dbConn.query(query, [99, "cashier", "manager"], (error, results) => {
  //   if (error) {
  //     console.log(error.sqlMessage);
  //   } else {
  //     return res.json({ cashiers: results, status: "success" });
  //   }
  // });
};

export default FetchReceiptsCachiers;
