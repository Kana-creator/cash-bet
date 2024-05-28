const FetchShopBalance = (req, res, dbConn) => {
  const { shop_id } = req.params;
  const date = new Date();
  const query =
    "SELECT SUM(stake) AS shop_balance FROM receipt WHERE shop_id=? AND YEAR(date_added)=? AND MONTH(date_added)=? AND DAY(date_added)=?";

  dbConn.query(
    query,
    [shop_id, date.getFullYear(), date.getMonth() + 1, date.getDate()],
    (error, results) => {
      if (error) {
        console.log(error);
        res.json({ message: error.sqlMessage, status: "error" });
      } else {
        res.json({ shop_balance: results[0].shop_balance, status: "success" });
      }
    }
  );
};

export default FetchShopBalance;
