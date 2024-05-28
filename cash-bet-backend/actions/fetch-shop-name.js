const FetchShopName = (req, res, dbConn) => {
  const { shopId } = req.params;
  const query = "SELECT shop_name FROM shop WHERE shop_id=?";
  dbConn.query(query, [shopId], (error, results) => {
    if (error) {
      console.log(error.sqlMessage);
    } else {
      return res.json({ shopName: results[0].shop_name });
    }
  });
};

export default FetchShopName;
