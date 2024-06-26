const FetchAllCashiers = (res, dbConn, user_id) => {
  const query =
    "SELECT COUNT(user_id) AS allCashiers FROM user WHERE user_role=? AND linked_to=?";

  dbConn.query(query, ["cashier", user_id], (error, result) => {
    // check for any errors in the sql query
    if (error) {
      return res.json({ message: error.sqlMessage, status: "error" });
    } else {
      //check if any cashier is found for this particular partner
      if (result.length < 1) {
        console.log("No cashier found for this particular partner.");
      } else {
        // if found return the number of cahiers to the partner dashboard
        return res.json({
          allCashiers: result[0].allCashiers,
          status: "success",
        });
      }
    }
  });
};

export default FetchAllCashiers;
