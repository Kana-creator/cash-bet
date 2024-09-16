const FetchCashierDailyReceipts = (res, cashier_id, dbConn) => {
  const date = new Date();

  const query =
    "SELECT COUNT(receipt_id) AS receipts FROM receipt WHERE cashier_id=? AND YEAR(date_added)=? AND MONTH(date_added)=? AND DAY(date_added)=? AND receipt_status != ?";

  dbConn.query(
    query,
    [cashier_id, date.getFullYear(), date.getMonth() + 1, date.getDate(), 3],
    (error, results) => {
      if (error) {
        console.log(error);
        res.json({ message: error.sqlMessage, status: "error" });
      } else {
        res.json({ receipts: results[0].receipts, status: "success" });
      }
    }
  );
};

export default FetchCashierDailyReceipts;
