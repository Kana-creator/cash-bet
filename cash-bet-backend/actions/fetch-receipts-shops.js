const FetchReceiptsShops = (req, res, dbConn) => {
  const { user_id } = req.params;
  const query =
    "SELECT created_by, shop_id, shop_name FROM shop WHERE created_by=? AND shop_name != ?";

  dbConn.query(query, [99, "Head office"], (error, results) => {
    if (error) {
      console.log(error.sqlMessage);
    } else {
      return res.json({
        shops: results,
        admin_id: results[0].created_by,
        status: "error",
      });
    }
  });
};

export default FetchReceiptsShops;
