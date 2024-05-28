const FetchReceiptResults = (req, res, dbConn) => {
  const { receipt_number, shop_id } = req.params;
  const query =
    "SELECT * FROM receipt r WHERE r.receipt_number=? AND r.shop_id=?";

  dbConn.query(query, [receipt_number, shop_id], (error, results) => {
    if (error) {
      res.json({ message: error.sqlMessage, status: "error" });
    } else {
      if (results.length === 0) {
        res.json({
          message:
            "Receipt not found please check your receipt number and try again.",
          status: "error",
        });
      } else {
        res.json({ receipt: results, status: "success" });
      }
    }
  });
};

export default FetchReceiptResults;
