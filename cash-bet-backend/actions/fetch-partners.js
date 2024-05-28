const FetchPartners = (res, dbConn, user_id) => {
  const query =
    "SELECT * FROM user WHERE user_role=? OR user_role=? ORDER BY user_id DESC";

  dbConn.query(
    query,
    ["partner", "internal partner", user_id],
    (error, results) => {
      if (error) {
        return res
          .status(201)
          .json({ message: error.sqlMessage, status: "error" });
      } else if (results.length === 0) {
        return res
          .status(201)
          .json({ message: "No partner added yet !", status: "error" });
      } else {
        return res.status(200).json({ partners: results, status: "success" });
      }
    }
  );
};

export default FetchPartners;
