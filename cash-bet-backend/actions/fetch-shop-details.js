const FetchShopDetails = (res, dbConn, shop_id, operator_id) => {
  let query = "";
  if (operator_id !== `0`) {
    query =
      "SELECT * FROM shop INNER JOIN user ON shop.operator=user.user_id  WHERE shop.shop_id=?";
  } else {
    query = "SELECT * FROM shop WHERE shop.shop_id=?";
  }

  dbConn.query(query, [shop_id], (error, results) => {
    if (error) {
      return res
        .status(200)
        .json({ message: error.sqlMessage, status: "error" });
    } else {
      return res.status(200).json({ shop: results[0], status: "success" });
    }
  });
};

export default FetchShopDetails;
