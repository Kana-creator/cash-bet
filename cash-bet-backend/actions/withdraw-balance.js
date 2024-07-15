import bcryptjs from "bcryptjs";

const WithdrawBalance = (req, res, dbConn) => {
  let query =
    "SELECT user_id, user_password FROM user WHERE user_telephone=? OR user_email=?";

  // CHECK IF THE WITHDRAWER EXISTS
  dbConn.query(
    query,
    [req.body.email, req.body.email, req.body.password],
    async (error, results) => {
      if (error) {
        console.log(error.sqlMessage);
      } else {
        if (results.length === 0) {
          res.json({
            message:
              "User account not found. Check email or telephone and password.",
            status: "error",
          });
        } else if (`${results[0].user_id}` === req.body.cashier_id) {
          res.json({
            message: "You can't withdraw your own balance.",
            status: "error",
          });
        } else {
          // PROCEED WITHDRAWING IF THE WITHDRAWEAR ACCOUNT IS FOUND
          const withdrawer_id = results[0].user_id;
          const values = [withdrawer_id, req.body.cashier_id, req.body.amount];
          const isMatch = await bcryptjs.compare(
            req.body.password,
            results[0].user_password
          );
          if (!isMatch) {
            res.json({
              message:
                "User account not found. Check email or telephone and password.",
              status: "error",
            });
          } else {
            query =
              "INSERT INTO withdraw(withdrawer_id, cashier_id,  amount) VALUES(?)";

            dbConn.query(query, [values], (error) => {
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
    }
  );
};

export default WithdrawBalance;
