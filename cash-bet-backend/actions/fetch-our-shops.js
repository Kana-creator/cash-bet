const FetchOurShops = (res, dbConn) => {
  const query = "SELECT user_id FROM user WHERE user_role=?";
  dbConn.query(query, ["internal partner"], (error, results) => {
    if (error) {
      return res.json({ message: error.sqlMessage, status: "error" });
    } else {
      if (results.length < 1) {
        console.log("No internal partner account found.");
      } else {
        const partner_id = results[0].user_id;
        const query =
          "SELECT COUNT(shop_id) AS our_shops FROM shop WHERE created_by=? AND shop_name!=?";

        dbConn.query(query, [partner_id, "Head office"], (error, results) => {
          if (error) {
            return res.json({
              message: error.sqlMessage,
              status: "error",
            });
          } else {
            return res.json({
              our_shops: results[0].our_shops,
              status: "success",
            });
          }
        });
      }
    }
  });
};

export default FetchOurShops;
