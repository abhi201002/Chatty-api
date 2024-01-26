const Messages = require("../models/messageModel");
const User = require("../models/userModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  const currentTime = new Date();
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    const result = await User.findOneAndUpdate({
        "$and":[
          {"friends.id": to},
          {_id : from}
        ]
      },
      {
        "friends.$.lastMess": currentTime
      },
      {new: true}
    )
    await User.findOneAndUpdate({
        "$and":[
          {"friends.id": from},
          {_id : to}
        ]
      },
      {
        "friends.$.lastMess": currentTime
      },
      {new: true}
    )


    if (data) return res.json(result);
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};


module.exports.updateLastMess = async (req, res, next) => {
  const user1 = req.params.user1;
  const user2 = req.params.user2;
  const currentTime = new Date();
  try {
    const result = await User.findOneAndUpdate({
        "$and":[
          {"friends.id": user2},
          {_id : user1}
        ]
      },
      {
        "friends.$.lastMess": currentTime
      },
      {new: true}
    )
    await User.findOneAndUpdate({
        "$and":[
          {"friends.id": user1},
          {_id : user2}
        ]
      },
      {
        "friends.$.lastMess": currentTime
      },
      {new: true}
    )

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}