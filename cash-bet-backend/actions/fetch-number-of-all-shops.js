const FetchNumberOfAllShops = (res, dbConn) => {
  const query =
    "SELECT COUNT(shop_id) AS number_of_shops FROM shop WHERE shop_name!=?";

  dbConn.query(query, ["Head office"], (error, results) => {
    if (error) {
      return res.json({ message: error.sqlMessage, status: "error" });
    } else {
      return res.json({
        number_of_shops: results[0].number_of_shops,
        status: "success",
      });
    }
  });
};

export default FetchNumberOfAllShops;
