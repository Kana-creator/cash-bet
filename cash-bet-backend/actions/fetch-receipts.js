const FetchReceipts = (req, res, dbConn) => {
  const { linked_to, role } = req.params;
  const date = new Date();
  const month = date.getMonth();

  console.log(linked_to, role);

  if (role === "Admin" || role === "other admin") {
    const query = "SELECT user_id FROM user WHERE user_role=?";
    dbConn.query(query, ["internal partner"], (error, results) => {
      if (error) {
        console.log(error.sqlMessage);
      } else {
        if (results.length < 1) {
          console.log("No internal partner found.");
        } else {
          const admin_id = results[0].user_id;
          console.log("Admin id = :  " + admin_id);
          const query =
            "SELECT * FROM receipt WHERE (MONTH(date_added)=? OR MONTH(date_added)=?) AND admin_id=?";
          dbConn.query(
            query,
            [month, month + 1, admin_id],
            (error, results) => {
              if (error) {
                console.log(error.sqlMessage);
              } else {
                return res.json({ receipts: results, status: "error" });
              }
            }
          );
        }
      }
    });
  } else {
    const query =
      "SELECT * FROM receipt WHERE (MONTH(date_added)=? OR MONTH(date_added)=?) AND admin_id=?";
    dbConn.query(query, [month, month + 1, linked_to], (error, results) => {
      if (error) {
        console.log(error.sqlMessage);
      } else {
        return res.json({ receipts: results, status: "error" });
      }
    });
  }
};

export default FetchReceipts;
