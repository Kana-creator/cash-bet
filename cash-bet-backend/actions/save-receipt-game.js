const SaveReceiptGames = (req, res, dbConn) => {
  const games = req.body.games.map((game) => [
    game.event_id,
    game.game_number,
    req.body.receiptNumber,
    game.bet,
    game.odd,
    game.home_team,
    game.away_team,
    game.date_played,
  ]);

  const receipt = [
    req.body.receipt.shop_id,
    req.body.receipt.cashier_id,
    req.body.linked_to,
    req.body.receiptNumber,
    req.body.receipt.stake,
    req.body.receipt.total_odds,
    req.body.receipt.possible_win,
    new Date(),
  ];

  const query =
    "INSERT INTO receipt(shop_id, cashier_id, admin_id, receipt_number, stake, total_odds, possible_win, date_added) VALUES(?)";

  dbConn.query(query, [receipt], (error) => {
    if (error) {
      console.log(error.sqlMessage);
      return res.json({ message: error.sqlMessage, status: "error" });
    } else {
      const credit = [
        req.body.admin_id,
        req.body.receipt.cashier_id,
        req.body.receipt.stake,
        "minus",
        new Date(),
      ];

      const query =
        "INSERT INTO credit( given_by, given_to, credit_amount,  credit_type, transaction_date) VALUES(?)";

      dbConn.query(query, [credit], async (error) => {
        if (error) {
          res.json({ message: error.sqlMessage, status: "error" });
        } else {
          games.forEach((game, index) => {
            const query =
              "INSERT INTO game(event_id, game_number, receipt_number, bet, odd, home, away, date_played) VALUES(?)";
            dbConn.query(query, [game], (error) => {
              if (error) {
                console.log(error);
              }
            });
          });
          // const admin_id = req.body.admin_id;

          // const connection = await dbConn2.getConnection();
          // const BATCH_SIZE = 1;
          // try {
          //   await connection.beginTransaction();

          //   for (let i = 0; i < games.length; i += BATCH_SIZE) {
          //     const batch = games.slice(i, i + BATCH_SIZE);

          //     await connection.query(
          //       "INSERT INTO game(event_id, game_number, receipt_number, bet, odd) VALUES ?",
          //       [batch]
          //     );

          //     await connection.commit();
          //   }
          //   res.json({ message: "Saved successfully.", status: "success" });
          // } catch (error) {
          //   // Error handling
          //   await connection.rollback();

          //   console.error(error);
          //   res.json({ message: error.sqlMessage, status: "error" });
          // } finally {
          //   await connection.release();
          // }
        }
      });
    }
  });

  return res.json({ message: "saved successfully", status: "success" });
};

export default SaveReceiptGames;
