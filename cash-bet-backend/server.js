import express from "express";

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import mysql from "mysql";
import mysql2 from "mysql2/promise";
import { Sequelize as sequelize } from "sequelize";
import jwt from "jsonwebtoken";
import AdminSignUp from "./actions/admin-signup.js";
import CheckAdminAccount from "../cash-bet-backend/actions/check-admin-account.js";
import UserLogin from "./actions/user-login.js";
import AddUser from "./actions/add-user.js";
import verifyAuth from "./actions/verify-auth.js";
import AddShop from "./actions/add-shop.js";
import FetchPartners from "./actions/fetch-partners.js";
import FetchUsers from "./actions/fetch-users.js";
import fetchShops from "./actions/fetch-shops.js";
import FetchOperators from "./actions/fetch-operators.js";
import UserLogOut from "./actions/user-logout.js";
import DeleteUser from "./actions/delete-user.js";
import DeleteShop from "./actions/delete-shop.js";
import BlockUser from "./actions/block-user.js";
import UnBlockUser from "./actions/unblock-user.js";
import FetchUserDetails from "./actions/fetch-user-details.js";
import UpdateUser from "./actions/update-user.js";
import CreditTransaction from "./actions/credit-transaction.js";
import FetchBlockStatus from "./actions/fetch-block-status.js";
import FetchShopDetails from "./actions/fetch-shop-details.js";
import UpdateShop from "./actions/update-shop.js";
import FetchAdminUserDetails from "./actions/fetch-admin-user-details.js";
import FetchCreditBalance from "./actions/fetch-credit-balance.js";
import fetchDutyStations from "./actions/fetch-duty-station.js";
import FetchCashiers from "./actions/fetch-cashiers.js";
import axios from "axios";
import StartSession from "./actions/start-session.js";
import EndSession from "./actions/end-session.js";
import FetchSingleUserSession from "./actions/fetch-single-user-session.js";
import FetchAdminRights from "./actions/fetch-admin-rights.js";
import UpdateAdminUser from "./actions/update-admin-user.js";
import FetchAllSystemUsers from "./actions/fetch-all-system-users.js";
import FetchAllPartners from "./actions/fetch-all-partners.js";
import FetchAllAdminStaff from "./actions/fetch-all-admin-staff.js";
import FetchMonthlyUserRegistration from "./actions/fetch-monthly-user-registration.js";
import FetchAllUsersByCatecgory from "./actions/fetch-all-users-by-category.js";
import FetchNumberOfAllShops from "./actions/fetch-number-of-all-shops.js";
import FetchOurShops from "./actions/fetch-our-shops.js";
import FetchShopsPerLocation from "./actions/fetch-shops-per-location.js";
import FetchTotalCreditSubscription from "./actions/fetch-total-credit-subscription.js";
import FetchSubscriptionThisYear from "./actions/Fetch-subscription-this-year.js";
import FetchSubscriptionThisMonth from "./actions/fetch-subscription-this-month.js";
import FetchMonthlySubscription from "./actions/fetch-monthly-subscription.js";
import FetchAnualSubscription from "./actions/fetch-anual-subscription.js";

// import xml2js from "xml2js";

const app = express();
const port = 1991;

import { Server } from "socket.io";
import { createServer } from "http";
import SaveReceiptGames from "./actions/save-receipt-game.js";
import FetchGames from "./actions/fetch-api-games.js";
import FetchCashierDailyReceipts from "./actions/fetch-cashier-daily-receipts.js";
import FetchReceiptResults from "./actions/fetch_receipt_results.js";
import FetchResultGames from "./actions/fetch-result-games.js";
import FetchGameResults from "./actions/fetch-game-results.js";
import PayReceipt from "./actions/pay-receipt.js";
import FetchShopBalance from "./actions/fetch-shop-balance.js";
import FetchManagerBalance from "./actions/fetch-manager-balance.js";
import FetchResultIDs from "./actions/fetch-result-ids.js";
import CancelReceipt from "./actions/cancel-receipt.js";
import ChangeReceiptStatus from "./actions/change-receipt-status.js";
import SaveGameResults from "./actions/SaveGameResults.js";
import FetchDatabaseResults from "./actions/fetch-database-results.js";
import FetchReceipts from "./actions/fetch-receipts.js";
import FetchShopName from "./actions/fetch-shop-name.js";
import FetchCashierName from "./actions/fetch-cashier-name.js";
import FetchResults from "./actions/fetch-results.js";
import FetchReceiptsCachiers from "./actions/fetch-receipts-cashiers.js";
import FetchReceiptsShops from "./actions/fetch-receipts-shops.js";
// import ReduceCredit from "./actions/reduce-credit.js";
// import SaveReceipt from "./actions/save-receipt.js";

const httpServer = createServer();
const io = new Server(httpServer, {
  // path: "/my-socket-path",
  serveClient: true, // Don't serve the client-side library
  // transports: ["websocket"], // Only allow WebSockets
  cors: {
    origin: "*", // Allow CORS from this origin
  },
});

app.use(express.json());
app.use(cors());

// DATABASE CONNECTION

const dbConn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD + "#",
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

const dbConn2 = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD + "#",
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

// GAMES API KEY
const API_KEY = process.env.GAMES_API_KEY;

// GAMES API URL
const GAMES_URL = process.env.GAMES_API_URL;

// const parseXml = async (xmlString) => {
//   try {
//     const parser = new xml2js.Parser();
//     const parsedXml = await parser.parseStringPromise(xmlString);
//     return parsedXml;
//   } catch (error) {
//     console.error("Error parsing XML:", error);
//     throw error;
//   }
// };

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // dbConn.query(
//   //   "SELECT SUM(credit_amount) AS credit FROM credit WHERE credit_type=?",
//   //   ["plus"],
//   //   (error, result) => socket.emit("chat message", result[0].credit)
//   // );
// });

// CREATING A SUPER ADMIN ACCOUNT
app.post("/adminSignup", (req, res) => {
  !dbConn
    ? res
        .status(500)
        .json({ message: "Internal server error", status: "error" })
    : AdminSignUp(req, res, dbConn);
});

// CHECKING IF ADMIN ACCOUNT IS CREATED
app.get("/adminStatus", (req, res) => {
  !dbConn
    ? res.status(500).json({ message: "Internal server error" })
    : CheckAdminAccount(res, dbConn);
});

// USER LOGIN
app.post("/userLogin", (req, res) => {
  UserLogin(req, res, dbConn, jwt);
});

// USER LOGOUT
app.post("/log-out", (req, res) => {
  UserLogOut(req, res, dbConn);
});

// ADDING A NEW USER TO THE DATABASE
app.post("/addUser", verifyAuth, (req, res) => {
  AddUser(req, res, dbConn);
});

app.post("/addShop/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  AddShop(req, res, dbConn, user_id);
});

// FECTCHING PARTNERS
app.get("/fetchPartners/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  FetchPartners(res, dbConn, user_id);
});

// FETCHING ALL USERS THAT ARE CREATED BY A PARTICULAR ADMIN
app.get(
  "/fetchUsers/:user_id/:user_role/:linked_to",
  verifyAuth,
  (req, res) => {
    const { user_id, user_role, linked_to } = req.params;
    FetchUsers(res, dbConn, user_id, user_role, linked_to);
  }
);

// FETCHING SHOPS
app.get("/fetchShops/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  fetchShops(res, dbConn, user_id);
});

// FETCHING DUTY STATIONS
app.get("/fetch-duty-stations/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  fetchDutyStations(res, dbConn, user_id);
});

// FETCHING OPERATORS
app.get("/fetchOperators/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  FetchOperators(res, dbConn, user_id);
});

// DELETING A USER
app.get("/delete-user/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  DeleteUser(res, dbConn, user_id);
});

// DELETING A SHOP
app.delete("/delete-shop/:shop_id", verifyAuth, (req, res) => {
  const { shop_id } = req.params;
  DeleteShop(res, dbConn, shop_id);
});

// BLOCKING A USER
app.get("/block-user/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  BlockUser(res, dbConn, user_id);
});

// UNBLOCKING A USER
app.get("/unblock-user/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  UnBlockUser(res, dbConn, user_id);
});

// FETCHING SINGLE USER DETAILS
app.get("/fetch-user-details/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  FetchUserDetails(res, dbConn, user_id);
});

// FETCHING SINGLE USER DETAILS
app.get("/fetch-admin-user-details/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  FetchAdminUserDetails(res, dbConn, user_id);
});

// UPDATING USER DETAILS
app.post("/update-user/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;

  UpdateUser(req, res, dbConn, user_id);
});

// UPDATING ADMIN USER DETAILS
app.post("/update-admin-user/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  UpdateAdminUser(req, res, dbConn, user_id);
});

// ADD A CREDIT TRANSACTION
app.post("/credit-transaction/:user_id/:user_role", verifyAuth, (req, res) => {
  const { user_id, user_role } = req.params;
  CreditTransaction(req, res, dbConn, user_id, user_role);
});

// FETCHING USER INCOMING CREDIT
app.get("/fetch-credit-balance/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  FetchCreditBalance(res, dbConn, user_id);
});

// FETCH USER BLOCK STATUS
app.get("/fetch-block-status/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  FetchBlockStatus(res, dbConn, user_id);
});

// FETCH SHOP DETAILS
app.get("/fetch-shop-details/:shop_id/:operator_id", verifyAuth, (req, res) => {
  const { shop_id, operator_id } = req.params;
  FetchShopDetails(res, dbConn, shop_id, operator_id);
});

// UPDATING SHOP INFO
app.patch("/update-shop/:shop_id", verifyAuth, (req, res) => {
  const { shop_id } = req.params;
  UpdateShop(req, res, dbConn, shop_id);
});

// FETCHING CASHIERS
app.get("/fetchCashiers/:shop_id", verifyAuth, (req, res) => {
  const { shop_id } = req.params;
  FetchCashiers(res, dbConn, shop_id);
});

app.get("/fetch-games", async (req, res) => {
  FetchGames(res, axios);
});

// FETCH ALL FUTURE ODDS
app.get("/fetch-all-future-odds", (req, res) => {
  FetchFutureOdds(res, axios, API_KEY);
});

// STARTING SESSION
app.get("/start-session/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  StartSession(res, dbConn, user_id);
});

// ENDING SESSION
app.get("/end-session/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  EndSession(res, dbConn, user_id);
});

// FETCHING SINGLE USER SESSION
app.get("/fetch-single-user-session/:user_id", (req, res) => {
  const { user_id } = req.params;
  FetchSingleUserSession(res, dbConn, user_id);
});

// FETCHING ADMIN RIGHTS
app.get("/fetch-admin-rights/:user_id/:user_role", verifyAuth, (req, res) => {
  const { user_id, user_role } = req.params;
  FetchAdminRights(res, dbConn, user_id, user_role);
});

// FETCHING ALL SYSTEM USERS
app.get(
  "/fetch-all-system-users/:user_role/:view_dashboard",
  verifyAuth,
  (req, res) => {
    const { user_role, view_dashboard } = req.params;
    FetchAllSystemUsers(res, dbConn, user_role, view_dashboard);
  }
);

// FETCH ALL SYSTEM PARTNERS
app.get(
  "/fetch-all-system-partners/:user_role/:view_dashboard",
  verifyAuth,
  (req, res) => {
    const { user_role, view_dashboard } = req.params;
    FetchAllPartners(res, dbConn, user_role, view_dashboard);
  }
);

// FETCH ALL ADMIN STAFF
app.get(
  "/fetch-all-admin-staff/:user_id/:linked_to/:user_role/:view_dashboard",
  verifyAuth,
  (req, res) => {
    const { user_id, linked_to, user_role, view_dashboard } = req.params;
    FetchAllAdminStaff(
      res,
      dbConn,
      user_id,
      linked_to,
      user_role,
      view_dashboard
    );
  }
);

// FETCH ALL ADMIN STAFF
app.get(
  "/fetch-monthly-users-registration/:user_role/:view_dashboard/:year",
  verifyAuth,
  (req, res) => {
    const { user_role, view_dashboard, year } = req.params;
    FetchMonthlyUserRegistration(res, dbConn, user_role, view_dashboard, year);
  }
);

// FETCH ALL USERS BY CATEGORY
app.get(
  "/fetch-all-users-by-category/:user_role/:view_dashboard",
  verifyAuth,
  (req, res) => {
    const { user_role, view_dashboard } = req.params;
    FetchAllUsersByCatecgory(res, dbConn, user_role, view_dashboard);
  }
);

// FETCHING NUMBER OF ALL EXISINTING SHOPS
app.get("/fetch-number-od-all-shops", verifyAuth, (req, res) => {
  FetchNumberOfAllShops(res, dbConn);
});

// FETCH NUMBER OF OUR SHOPS
app.get("/fetch-our-shops", verifyAuth, (req, res) => {
  FetchOurShops(res, dbConn);
});

// FETCH SHOPS PER LOCATION
app.get("/fetch-shops-per-location", verifyAuth, (req, res) => {
  FetchShopsPerLocation(res, dbConn);
});

// FETCH TOTAL CREDIT SUBSCRIPTION
app.get("/fetch-total-credit-subscription/:user_id", verifyAuth, (req, res) => {
  const { user_id } = req.params;
  FetchTotalCreditSubscription(res, dbConn, user_id);
});

// FETCH CREDIT SUBSCRIPTION FOR THIS YEAR
app.get("/fetch-subscription-this-year", verifyAuth, (req, res) => {
  FetchSubscriptionThisYear(res, dbConn);
});

// FETCH SUBSCRIPTION THIS MONTH
app.get("/fetch-subscription-this-month", verifyAuth, (req, res) => {
  FetchSubscriptionThisMonth(res, dbConn);
});

// FETCH MONTHLY SUBSCRIPTION
app.get("/fetch-monthly-subscription/:year", verifyAuth, (req, res) => {
  const { year } = req.params;
  FetchMonthlySubscription(res, dbConn, year);
});

// FETCH ANNUAL SUBSCRIPTION
app.get("/fetch-annual-subscription", verifyAuth, (req, res) => {
  FetchAnualSubscription(res, dbConn);
});

// SAVING EVENTS IDs
app.post("/save-event-numbers", (req, res) => {
  const values = req.body.event_numbers.map((en) => [en]);

  const query = "TRUNCATE TABLE event_id";
  dbConn.query(query, [], (error) => {
    if (error) {
      console.log(error);
    } else {
      // const query = "INSERT IGNORE INTO event_id(event_number) VALUES?";

      values.forEach((value, index) => {
        const query = "INSERT IGNORE INTO event_id(event_number) VALUES(?)";
        dbConn.query(query, [value], (error) => {
          if (error) {
            console.log(error);
          }
        });
      });
    }
  });
});

// FETCHING EVENT IDs
app.get("/fetch-event-numbers", (req, res) => {
  const query = "SELECT * FROM event_id";
  dbConn.query(query, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      return res.json({ event_IDs: results, status: "success" });
    }
  });
});

// SAVING RECEIPT GAMES
app.post("/save-receipt-games", (req, res) => {
  SaveReceiptGames(req, res, dbConn, dbConn2);
});

// FETCHING CASHIER DAILY RECEIPTS
app.get("/fetch-cashier-daily-receipts/:cashier_id", (req, res) => {
  const { cashier_id } = req.params;
  FetchCashierDailyReceipts(res, cashier_id, dbConn);
});

// FETCHING RECEIPT RESULTS
app.get("/fetch-receipt-results/:receipt_number/:shop_id", (req, res) => {
  FetchReceiptResults(req, res, dbConn);
});

// FETCHING RESULT GAMES FROM THE DATABASE
app.get("/fetch-result-games/:receipt_number", (req, res) => {
  FetchResultGames(req, res, dbConn);
});

// FETCHING ADMIN ID
app.get("/fetch-admin-id", (req, res) => {
  dbConn.query(
    "SELECT user_id FROM user WHERE user_role='Admin'",
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.json({ adminId: result[0].user_id });
      }
    }
  );
});

// FETCHING GAME RESULTS
app.get("/fetch-api-results/:event_id", (req, res) => {
  FetchGameResults(req, res, axios);
});

// CASHING OUT A RECEIPT
// app.put("/pay-receipt/:receipt_number", (req, res) => {
//   PayReceipt(req, res, dbConn);
// });

// FETCHING SHOP BALANCE
app.get("/fetch-shop-balance/:shop_id", (req, res) => {
  FetchShopBalance(req, res, dbConn);
});

// FETCHING MANAGER OR CASHIER BALANCE
app.get("/fetch-manager-balance/:user_id", (req, res) => {
  FetchManagerBalance(req, res, dbConn);
});

// FETCHING RESULT IDs
app.get("/fetch-result-ids", (req, res) => {
  FetchResultIDs(res, dbConn);
});

// CANCELLING A RECEIPT
// app.put("/cancel-receipt/:receipt_number", (req, res) => {
//   console.log(req.params);
//   CancelReceipt(req, res, dbConn);
// });

// CHANGING RECEIPT STATUS
app.put("/change-receipt-status/:status/:receipt_number", (req, res) => {
  ChangeReceiptStatus(req, res, dbConn);
});

// SAVING RESULTS
app.put("/save-results", (req, res) => {
  SaveGameResults(req, res, dbConn);
});

// FETCHING DATABASE RESULTS
app.get("/fetch-database-results", (req, res) => {
  FetchDatabaseResults(res, dbConn);
});

// FETCHING RECEIPTS
app.get("/fetch-receipts/:linked_to/:role", (req, res) => {
  FetchReceipts(req, res, dbConn);
});

// FETCHING SHOP NAME
app.get("/fetch-shop-name/:shopId", (req, res) => {
  FetchShopName(req, res, dbConn);
});

// FETCHING CASHIER NAME
app.get("/fetch-cashier-name/:userId", (req, res) => {
  FetchCashierName(req, res, dbConn);
});

// FETCHING RESULTS BASING ON THE RECEIPT NUMBER
app.get("/fetch-results/:receiptNumber", (req, res) => {
  FetchResults(req, res, dbConn);
});

// FETCH RECEIPTS CASHIERS
app.get("/fetch-receipts-cashiers/:user_id", (req, res) => {
  FetchReceiptsCachiers(req, res, dbConn);
});

// FETCH RECEIPTS SHOPS
app.get("/fetch-receipts-shops/:user_id", (req, res) => {
  FetchReceiptsShops(req, res, dbConn);
});

httpServer.listen(1992, () => console.log(`Server listening on port ${1992}`));

app.listen(port, () => console.log(`App listening on port ${port}`));
