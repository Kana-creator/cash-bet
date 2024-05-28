const DeleteShop = (res, dbConn, shop_id) => {
  const query = "DELETE FROM shop WHERE shop_id=?";

  dbConn.query(query, [shop_id], (error) => {
    if (error) {
      return res
        .status(200)
        .json({ message: error.sqlMessage, status: "error" });
    } else {
      return res
        .status(200)
        .json({
          message: "Shop has been deleted successfully!",
          status: "success",
        });
    }
  });
};

export default DeleteShop;
