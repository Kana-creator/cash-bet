const FetchMonthlySubscription = (res, dbConn, year, user_role, user_id) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let query = "SELECT user_id FROM user WHERE user_role=?";

  dbConn.query(query, ["Admin"], (error, results) => {
    if (error) {
      console.log(error.sqlMessage);
    } else {
      let arrayValues = [];

      if (user_role === "partner" || user_role === "internal partner") {
        query =
          "SELECT SUM((CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END) - (CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END)) AS credit_amount, MONTH(credit.transaction_date) AS transaction_month FROM credit INNER JOIN user ON user.user_id=credit.given_to WHERE YEAR(credit.transaction_date)=? AND given_to=? GROUP BY MONTH(transaction_date) ORDER BY MONTH(transaction_date)";
        arrayValues = [
          "plus",
          results[0].user_id,
          "minus",
          results[0].user_id,
          year,
          user_id,
        ];
      } else {
        query =
          "SELECT SUM((CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END) - (CASE WHEN credit_type=? AND given_by=? THEN credit_amount ELSE 0 END)) AS credit_amount, MONTH(credit.transaction_date) AS transaction_month FROM credit INNER JOIN user ON user.user_id=credit.given_to WHERE YEAR(credit.transaction_date)=? AND user.user_role=? GROUP BY MONTH(transaction_date) ORDER BY MONTH(transaction_date)";
        arrayValues = [
          "plus",
          results[0].user_id,
          "minus",
          results[0].user_id,
          year,
          "partner",
        ];
      }

      dbConn.query(query, arrayValues, (error, result) => {
        if (error) {
          return res.json({ message: error.sqlMessage, status: "error" });
        } else {
          const MyResults = [];
          for (let i = 1; i <= months.length; i++) {
            MyResults.push(
              result
                .map((r) =>
                  months[r.transaction_month] === months[i]
                    ? r.credit_amount
                    : 0
                )
                .reduce(
                  (calculator, previousNumber) => calculator + previousNumber,
                  0
                )
            );
          }

          return res.json({
            monthly_subscription: MyResults.map((m, i) => {
              return { month: months[i], subscription: m };
            }),
            status: "success",
          });
        }
      });
    }
  });
};

export default FetchMonthlySubscription;
