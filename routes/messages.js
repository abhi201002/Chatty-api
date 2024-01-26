const { addMessage, getMessages, updateLastMess } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.put("/updateTime/:user1/:user2", updateLastMess);

module.exports = router;

//2024-01-08T21:06:46.299+00:00