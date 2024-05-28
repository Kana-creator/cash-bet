const FetchOperators = (res, dbConn, user_id) => {
  const query = "SELECT * FROM user WHERE user_role=? AND linked_to=?";
  dbConn.query(query, ["operator", user_id], (error, results) => {
    if (error) {
      return res
        .status(201)
        .json({ message: error.sqlMessage, status: "error" });
    } else if (results.length < 1) {
      return res
        .status(201)
        .json({ message: "No operator added yet !", status: "error" });
    } else {
      return res.status(200).json({ status: "success", operators: results });
    }
  });
};

export default FetchOperators;
