const FetchUserDetails = (res, dbConn, user_id) => {
  const query =
    "SELECT * FROM user INNER JOIN shop ON user.duty_station=shop.shop_id WHERE user.user_id=?";

  dbConn.query(query, [user_id], (error, results) => {
    if (error) {
      return res
        .status(200)
        .json({ message: error.sqlMessage, status: "error" });
    } else if (results.length === 0) {
      return res
        .status(200)
        .json({ message: "No user found!", status: "error" });
    } else {
      return res.status(200).json({ user: results[0], status: "success" });
    }
  });
};

export default FetchUserDetails;
