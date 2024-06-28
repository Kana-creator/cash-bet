const FetchShopsPerLocation = (res, dbConn, user_role, user_id) => {
  let query = "";

  query = "SELECT user_id FROM user WHERE user_role=?";

  dbConn.query(query, ["internal partner"], (error, result) => {
    if (error) {
      return res.json({ message: error.sqlMessage, staus: "error" });
    } else {
      if (result.length < 1) {
        console.log("No internal partner found.");
      } else {
        let user_idd = "";

        if (user_role === "Admin" || user_role === "other admin") {
          user_idd = result[0].user_id;
        } else {
          user_idd = user_id;
        }

        query =
          "SELECT SUM(CASE WHEN created_by=? THEN 1 ELSE 0 END) AS value, SUM(CASE WHEN created_by!=? THEN 1 ELSE 0 END) AS value2, shop_location AS name FROM shop WHERE shop_name!=? GROUP BY shop_location";

        dbConn.query(
          query,
          [user_idd, user_idd, "Head office"],
          (error, result) => {
            if (error) {
              return res.json({ message: error.sqlMessage, status: "error" });
            } else {
              if (result.length < 1) {
                console.log(
                  "No shop was found when fetching all shops per location."
                );
              } else {
                return res.json({
                  shops_per_location: result,
                  status: "success",
                });
              }
            }
          }
        );
      }
    }
  });
};

export default FetchShopsPerLocation;
