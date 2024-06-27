const FetchOurShops = (res, dbConn, user_role, user_id) => {
  const query = "SELECT user_id FROM user WHERE user_role=?";
  dbConn.query(query, ["internal partner"], (error, results) => {
    if (error) {
      return res.json({ message: error.sqlMessage, status: "error" });
    } else {
      if (results.length < 1) {
        console.log("No internal partner account found.");
      } else {
        let partner_id = results[0].user_id;

        if (user_role === "Admin" || user_role === "other admin") {
          partner_id = results[0].user_id;
        } else {
          partner_id = user_id;
        }
        let query =
          "SELECT COUNT(shop_id) AS our_shops FROM shop WHERE created_by=? AND shop_name!=?";

        dbConn.query(query, [partner_id, "Head office"], (error, results) => {
          if (error) {
            return res.json({
              message: error.sqlMessage,
              status: "error",
            });
          } else {
            if (results < 1) {
              console.log(
                "No shop was found when finding the number of all our shops."
              );
            } else {
              return res.json({
                our_shops: results[0].our_shops,
                status: "success",
              });
            }
          }
        });
      }
    }
  });
};

export default FetchOurShops;
