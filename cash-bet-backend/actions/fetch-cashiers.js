const FetchCashiers = (res, dbConn, shop_id) => {
  const query =
    "SELECT * FROM user INNER JOIN shop ON user.duty_station=shop.shop_id WHERE user_role = ? AND duty_station=? ORDER BY user.user_id DESC";

  dbConn.query(query, ["cashier", shop_id], (error, results) => {
    if (error) {
      return res
        .status(201)
        .json({ message: error.sqlMessage, status: "error" });
    } else if (results.length === 0) {
      return res
        .status(201)
        .json({ message: "No Cashier found !", status: "error" });
    } else {
      return res.status(200).json({ users: results, status: "success" });
    }
  });
};

export default FetchCashiers;
