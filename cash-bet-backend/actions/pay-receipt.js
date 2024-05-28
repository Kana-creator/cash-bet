const PayReceipt = (req, res, dbConn) => {
  const { receipt_number } = req.params;

  const query =
    "SELECT receipt_status, action_date FROM receipt WHERE receipt_number=?";

  dbConn.query(query, [receipt_number], (error, results) => {
    if (error) {
      console.log(error);
    } else {
      if (results[0].payout_status === 1) {
        res.json({
          message: `Receipt ${receipt_number} already cashed out on ${results[0].action_date}`,
          status: "error",
        });
      } else {
        const query =
          "UPDATE receipt SET receipt_status=?, action_date=? WHERE receipt_number=?";
        dbConn.query(query, [4, new Date(), receipt_number], (error) => {
          if (error) {
            console.log(error);
          } else {
            res.json({
              message: "Receipt has been cashed out successfully.",
              status: "success",
            });
          }
        });
      }
    }
  });
};

export default PayReceipt;
