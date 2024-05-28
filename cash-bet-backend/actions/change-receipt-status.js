const ChangeReceiptStatus = (req, res, dbConn) => {
  const { status, receipt_number } = req.params;
  var message = "";

  if (status === "3") {
    message = "Receipt has been cancelled successfully.";
  } else if (status === "4") {
    message = "Receipt has been paid successfully.";
  } else {
    message = "";
  }
  const query =
    "UPDATE receipt SET action_date=?, receipt_status=? WHERE receipt_number=?";

  dbConn.query(query, [new Date(), status, receipt_number], (error) => {
    if (error) {
      console.log(error.sqlMessage);
    } else {
      res.json({ status: "success", message: "Status changed to " + status });
    }
  });
};

export default ChangeReceiptStatus;
