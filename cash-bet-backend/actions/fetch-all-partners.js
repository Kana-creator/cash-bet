const FetchAllPartners = (res, dbConn, user_role, view_dashboard) => {
  const query =
    "SELECT COUNT(user_id) AS allPartners FROM user WHERE user_role=?";

  dbConn.query(query, ["partner"], (error, result) => {
    if (error) {
      return res.json({ message: error.sqlMessage, status: "error" });
    } else {
      return res.json({
        allPartners: result[0].allPartners,
        status: "success",
      });
    }
  });
};

export default FetchAllPartners;
