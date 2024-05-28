const FetchAdminRights = (res, dbConn, user_id, user_role) => {
  const query = "SELECT * FROM admin_rights WHERE user_id = ?";

  dbConn.query(query, [user_id], (error, results) => {
    if (error) {
      return res.json({ message: error.sqmlMessage, status: "error" });
    } else {
      let adminRights;
      if (results.length === 0) {
        if (user_role !== "Admin") {
          adminRights = [
            {
              rights_id: 0,
              user_id: 0,
              view_dashboard: 0,
              view_partners: 0,
              add_partner: 0,
              add_credit: 0,
              block_partner: 0,
              delete_partner: 0,
              view_users: 0,
              add_user: 0,
              edit_user: 0,
              delete_user: 0,
              view_reports: 0,
            },
          ];
        } else {
          adminRights = [
            {
              rights_id: 0,
              user_id: 0,
              view_dashboard: 1,
              view_partners: 1,
              add_partner: 1,
              add_credit: 1,
              block_partner: 1,
              delete_partner: 1,
              view_users: 1,
              add_user: 1,
              edit_user: 1,
              delete_user: 1,
              view_reports: 1,
            },
          ];
        }
      } else {
        adminRights = results;
      }
      return res.json({ adminRights: adminRights, status: "success" });
    }
  });
};

export default FetchAdminRights;
