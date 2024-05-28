const UpdateShop = (req, res, dbConn, shop_id) => {
  console.log(req.body);
  const query =
    "UPDATE shop SET shop_name=?, shop_location=?, min_stake=?, max_stake=?, max_payout=?, operator=?, date_updated=? WHERE shop_id=?";

  dbConn.query(
    query,
    [
      req.body.shopName,
      req.body.shopLocation,
      req.body.miniStake,
      req.body.maxStake,
      // req.body.salesLimit,
      req.body.maxPaypout,
      req.body.adminId,
      new Date(),
      shop_id,
    ],
    (error) => {
      if (error) {
        return res.json({ message: error.sqlMessage, status: "error" });
      } else {
        return res.json({
          message: "Shop info has been updated successfully!",
          status: "success",
        });
      }
    }
  );
};

export default UpdateShop;
