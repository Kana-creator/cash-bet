const FetchReceiptsShops = (req, res, dbConn) => {
  const { user_id, user_role } = req.params;

  console.log(user_role);

  if (user_role === "Admin" || user_role === "other admin") {
    const query = "SELECT user_id FROM user WHERE user_role=?";

    dbConn.query(query, ["internal partner"], (error, results) => {
      if (error) {
        console.log(error.sqlMessage);
      } else {
        if (results.length < 1) {
          console.log("No internal partner found.");
        } else {
          const created_by = results[0].user_id;

          const query =
            "SELECT created_by, shop_id, shop_name FROM shop WHERE created_by=? AND shop_name != ?";

          dbConn.query(query, [created_by, "Head office"], (error, results) => {
            if (error) {
              console.log(error.sqlMessage);
            } else {
              if (results < 1) {
                console.log("No shop found.");
              } else {
                return res.json({
                  shops: results,
                  admin_id: results[0].created_by,
                  status: "error",
                });
              }
            }
          });
        }
      }
    });
  } else {
    const query =
      "SELECT created_by, shop_id, shop_name FROM shop WHERE created_by=? AND shop_name != ?";

    dbConn.query(query, [user_id, "Head office"], (error, results) => {
      if (error) {
        console.log(error.sqlMessage);
      } else {
        if (results.length < 1) {
          console.log("No shop found.");
        } else {
          return res.json({
            shops: results,
            admin_id: results[0].created_by,
            status: "error",
          });
        }
      }
    });
  }
};

export default FetchReceiptsShops;
