const FetchShopBalance = (req, res, dbConn) => {
  const { shop_id } = req.params;
  console.log(shop_id);
  const date = new Date();
  const query =
    "SELECT SUM(stake) AS shop_balance FROM receipt WHERE shop_id=?";

  dbConn.query(query, [shop_id], (error, results) => {
    if (error) {
      console.log(error);
      res.json({ message: error.sqlMessage, status: "error" });
    } else {
      res.json({ shop_balance: results[0].shop_balance, status: "success" });
    }
  });
};

export default FetchShopBalance;
