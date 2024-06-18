const FetchShopsPerLocation = (res, dbConn) => {
  const query = "SELECT user_id FROM user WHERE user_role=?";
  dbConn.query(query, ["internal partner"], (error, result) => {
    if (error) {
      return res.json({ message: error.sqlMessage, staus: "error" });
    } else {
      if (result.length < 1) {
        console.log("No internal partner found.");
      } else {
        const user_id = result[0].user_id;
        const query =
          "SELECT SUM(CASE WHEN created_by=? THEN 1 ELSE 0 END) AS value, SUM(CASE WHEN created_by!=? THEN 1 ELSE 0 END) AS value2, shop_location AS name FROM shop WHERE shop_name!=? GROUP BY shop_location";

        dbConn.query(
          query,
          [user_id, user_id, "Head office"],
          (error, result) => {
            if (error) {
              return res.json({ message: error.sqlMessage, status: "error" });
            } else {
              return res.json({
                shops_per_location: result,
                status: "success",
              });
            }
          }
        );
      }
    }
  });
};

export default FetchShopsPerLocation;
