const fetchDutyStations = (res, dbConn, user_id) => {
  const query =
    "SELECT * FROM shop WHERE shop.created_by=?  ORDER BY shop.shop_id DESC";

  dbConn.query(query, [user_id], (error, results) => {
    if (error) {
      return res
        .status(201)
        .json({ message: error.sqlMessage, status: "error" });
    } else if (results.length === 0) {
      return res
        .status(201)
        .json({ message: "No shop added yet !", status: "error" });
    } else {
      return res.status(200).json({ shops: results, status: "success" });
    }
  });
};

export default fetchDutyStations;
