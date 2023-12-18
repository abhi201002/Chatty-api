const express = require("express")
const { findFriends, sendReq, acceptReq, findRequest, rejectReq } = require( "../controllers/friendsController.js")



const routes = express.Router()

routes.get("/getAllfriends/:cur_user", findFriends);
routes.get("/getRequest/:cur_user", findRequest);
routes.post("/requestfriends/:cur_user/:user", sendReq);
routes.post("/acceptfriends/:cur_user/:user", acceptReq);
routes.post("/rejectfriends/:cur_user/:user", rejectReq);

module.exports = routes