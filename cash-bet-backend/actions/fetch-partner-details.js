const FetchPartnerDetails = (res, dbConn, partner_id) => {
  const query = "SELECT company_name, logo FROM user WHERE user_id=?";

  dbConn.query(query, [partner_id], (error, result) => {
    if (error) {
      console.log(error.message);
      return;
    }

    console.log({ partner: result[0] });

    return res.json({ partner: result[0] });
  });
};

export default FetchPartnerDetails;
