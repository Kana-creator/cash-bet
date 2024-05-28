const CreditTransaction = (req, res, dbConn, user_id, user_role) => {
  const values = [
    req.body.given_by,
    req.body.given_to,
    req.body.credit_amount,
    req.body.credit_type,
    new Date(),
  ];

  if (req.body.credit_type === "minus") {
    const query =
      "SELECT SUM(CASE WHEN credit_type = ? THEN credit_amount ELSE 0 END )-SUM(CASE WHEN credit_type = ? THEN credit_amount ELSE 0 END) AS available_credit FROM credit WHERE given_to = ?;";

    dbConn.query(
      query,
      ["plus", "minus", req.body.given_to],
      (error, results) => {
        if (error) {
          return res
            .status(200)
            .json({ message: error.sqlMessage, status: "error" });
        } else if (results[0].available_credit < req.body.credit_amount) {
          return res.status(200).json({
            message: `Insafficient credit on the account! (You are trying to reduce more than the available credit on the account.)`,
            status: "error",
          });
        } else {
          const query = "SELECT block_status FROM user WHERE user_id=?";
          dbConn.query(query, [req.body.given_to], (error, results) => {
            if (error) {
              return res
                .status(200)
                .json({ message: error.sqlMessage, status: "error" });
            } else {
              const query =
                "INSERT INTO credit(given_by, given_to, credit_amount, credit_type, transaction_date) VALUES(?)";

              dbConn.query(query, [values], (error) => {
                if (error) {
                  return res
                    .status(200)
                    .json({ message: error.sqlMessage, status: "error" });
                } else {
                  return res.status(200).json({
                    credit_amount: req.body.credit_amount,
                    credit_type: req.body.credit_type,
                    message: "Transaction was successful!",
                    status: "success",
                  });
                }
              });
            }
          });
        }
      }
    );
  } else {
    const query = "SELECT block_status FROM user WHERE user_id=?";
    dbConn.query(query, [req.body.given_to], (error, results) => {
      if (error) {
        return res
          .status(200)
          .json({ message: error.sqlMessage, status: "error" });
      } else if (results[0].block_status === 1) {
        return res.status(200).json({
          message: "First unblock user before transacting!",
          status: "error",
        });
      } else {
        if (user_role !== "Admin" && user_role !== "other admin") {
          const query =
            "SELECT SUM(CASE WHEN credit_type = ? AND given_to=? THEN credit_amount ELSE 0 END + CASE WHEN credit_type = ? AND given_by=? THEN credit_amount ELSE 0 END)-SUM(CASE WHEN credit_type = ? AND given_to=? THEN credit_amount ELSE 0 END + CASE WHEN credit_type = ? AND given_by=? THEN credit_amount ELSE 0 END) AS available_credit FROM credit;";

          dbConn.query(
            query,
            [
              "plus",
              user_id,
              "minus",
              user_id,
              "minus",
              user_id,
              "plus",
              user_id,
            ],
            (error, results) => {
              if (error) {
                return res
                  .status(200)
                  .json({ message: error.sqlMessage, status: "error" });
              } else if (results[0].available_credit < req.body.credit_amount) {
                return res.status(200).json({
                  message: "Insafficient credit balance on your account!",
                  status: "error",
                });
              } else {
                const query =
                  "INSERT INTO credit(given_by, given_to, credit_amount, credit_type, transaction_date) VALUES(?)";

                dbConn.query(query, [values], (error) => {
                  if (error) {
                    return res
                      .status(200)
                      .json({ message: error.sqlMessage, status: "error" });
                  } else {
                    return res.status(200).json({
                      credit_amount: req.body.credit_amount,
                      credit_type: req.body.credit_type,
                      message: "Transaction was successful!",
                      status: "success",
                    });
                  }
                });
              }
            }
          );
        } else {
          const query =
            "INSERT INTO credit(given_by, given_to, credit_amount, credit_type, transaction_date) VALUES(?)";

          dbConn.query(query, [values], (error) => {
            if (error) {
              return res
                .status(200)
                .json({ message: error.sqlMessage, status: "error" });
            } else {
              return res.status(200).json({
                credit_amount: req.body.credit_amount,
                credit_type: req.body.credit_type,
                message: "Transaction was successful!",
                status: "success",
              });
            }
          });
        }
      }
    });
  }
};

export default CreditTransaction;
