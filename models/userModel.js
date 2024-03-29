const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  phone: {
    type: Number,
    required: false,
    unique: true,
    min: 10,
    max: 10,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
  friends:{
    type: [{id: {type: String, required: true}, lastMess: {type: Date, required: true, default: undefined}}],
    default:[]
  },
  request:{
    type: [String],
    default: []
  }
});

module.exports = mongoose.model("Users", userSchema);
