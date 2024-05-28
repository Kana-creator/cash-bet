const CancelReceipt = (req, res, dbConn) => {
  const { receipt_number } = req.params;
  const query =
    "UPDATE receipt SET action_date=?, receipt_status=? WHERE receipt_number=?";
  dbConn.query(query, [new Date(), 3, receipt_number], (error) => {
    if (error) {
      console.log(error.sqlMessage);
    } else {
      res.json({
        message: "Receipt cancelled successfully.",
        status: "success",
      });
    }
  });
};

export default CancelReceipt;
