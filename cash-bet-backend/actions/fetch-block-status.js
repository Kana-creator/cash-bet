const FetchBlockStatus = (res, dbConn, user_id) => {
  const query = "SELECT block_status FROM user WHERE user_id = ?";
  dbConn.query(query, [user_id], (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ message: error.sqlMessage, status: "error" });
    } else {
      return res
        .status(200)
        .json({ block_status: results[0], status: "success" });
    }
  });
};

export default FetchBlockStatus;
