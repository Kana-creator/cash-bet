const FetchCredit = (res, dbConn, userId) => {
  let query = "";

  query =
    " SELECT c.given_by, c.given_to, c.credit_amount, c.credit_type, c.transaction_date, u.first_name, u.last_name, u.user_telephone, u.user_role FROM credit c INNER JOIN user u ON u.user_id=c.given_to WHERE given_by=?";

  dbConn.query(query, [userId], (error, result) => {
    if (error) {
      console.log(error.message);
    } else {
      return res.json({ credit: result });
    }
  });
};

export default FetchCredit;
