const FetchReceiptsCachiers = (req, res, dbConn) => {
  const { user_id } = req.params;
  const query =
    "SELECT user_id, first_name, last_name FROM user WHERE linked_to=? AND (user_role=? OR user_role=?)";

  dbConn.query(query, [99, "cashier", "manager"], (error, results) => {
    if (error) {
      console.log(error.sqlMessage);
    } else {
      return res.json({ cashiers: results, status: "error" });
    }
  });
};

export default FetchReceiptsCachiers;
