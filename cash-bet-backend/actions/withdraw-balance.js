const WithdrawBalance = (req, res, dbConn) => {
  let query =
    "SELECT user_id FROM user WHERE (user_telephone=? OR user_email=?) AND user_password=?";

  // CHECK IF THE WITHDRAWER EXISTS
  dbConn.query(
    query,
    [req.body.email, req.body.email, req.body.password],
    (error, results) => {
      if (error) {
        console.log(error.sqlMessage);
      } else {
        if (results.length === 0) {
          res.json({
            message:
              "User account not found. Check email or telephone and password.",
            status: "error",
          });
        } else {
          // PROCEED WITHDRAWING IF THE WITHDRAWEAR ACCOUNT IS FOUND
          const withdrawer_id = results[0].user_id;
          const values = [withdrawer_id, req.body.cashier_id, req.body.amount];

          query =
            "INSERT INTO withdraw(cashier_id, withdrawer_id, amount) VALUES(?)";

          dbConn.query(query, values, (error) => {
            if (error) {
              console.log(error.sqlMessage);
            } else {
              res.json({
                message: "Amount  has been withdrawed successfully.",
                status: "success",
              });
            }
          });
        }
      }
    }
  );
};

export default WithdrawBalance;
