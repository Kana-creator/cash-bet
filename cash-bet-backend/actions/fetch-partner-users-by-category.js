const FetchPartnerUsersByCategory = (res, dbConn, user_d) => {
  const query =
    "SELECT COUNT(user_id) AS number_of_users, user_role FROM user WHERE linked_to=? GROUP BY user_role ";

  dbConn.query(query, [user_d], (error, result) => {
    // check for any errors in the sql query
    if (error) {
      console.log(error.sqlMessage);
    } else {
      // check if any user category for the particular partner is found
      if (result.length < 1) {
        console.log("No user category found for partner users.");
      } else {
        // return all the user category groups to the partner dashboard if found
        return res.json({
          usersByCategory: result,
          status: "success",
        });
      }
    }
  });
};

export default FetchPartnerUsersByCategory;
