const AddShop = (req, res, dbConn, user_id) => {
  const query = "SELECT * FROM shop WHERE shop_name = ? AND created_by=?";
  dbConn.query(query, [req.body.shopName, user_id], (error, results) => {
    if (error) {
      return res
        .status(201)
        .json({ message: error.sqlMessage, status: "error" });
    } else if (results.length > 0) {
      return res.status(201).json({
        message: "Shop with the same name already exists!",
        status: "error",
      });
    } else {
      const query =
        "INSERT INTO shop(created_by, shop_name, shop_location, min_stake, max_stake, max_payout, operator, date_added) VALUES(?)";

      const values = [
        req.body.adminId,
        req.body.shopName,
        req.body.shopLocation,
        req.body.miniStake,
        req.body.maxStake,
        // req.body.salesLimit,
        req.body.maxPaypout,
        req.body.shopOperator,
        new Date(),
      ];

      dbConn.query(query, [values], (error) => {
        if (error) {
          return res
            .status(201)
            .json({ message: error.sqlMessage, status: "error" });
        } else {
          return res.status(200).json({
            message: "Shop has been added successfully!",
            status: "success",
          });
        }
      });
    }
  });
};

export default AddShop;
