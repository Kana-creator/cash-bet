const FetchResultIDs = (res, dbConn) => {
  const query = "SELECT event_id FROM game";

  dbConn.query(query, [], (error, results) => {
    if (error) {
      console.log(error);
    } else {
      return res.json({ IDs: results, status: "success" });
    }
  });
};

export default FetchResultIDs;
