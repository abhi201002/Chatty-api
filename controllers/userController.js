const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    // console.log(user);
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const users = await User.findById({ _id: req.params.id })
    return res.status(200).json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

module.exports.search = async(req, res, next) => {
  const user_name = req.params.username;
  const cur_user = req.params.cur_user;

  try{
    let result = await User.find({username : {$regex: user_name}, _id: {$ne: cur_user}, "friends.id":{$ne: cur_user}});

    // result = result.filter(item => item.friends.includes(cur_user) === false) 

    res.status(200).json(result);
  }
  catch(err){
    next(err);
  }
}

module.exports.updateUser = async (req, res, next) => {
  const username  = req.body.username;
  try {
    if(username.length < 3 || username.length > 20) return res.json({msg: "Username should be of 3 to 20 letters", status: false});
    const duplicate = await User.findOne({username: username});
    if(duplicate) return res.json({msg: "Username already exists!", status: false});
    const users = await User.findByIdAndUpdate(req.params.id, {username: username}, {new: true});
    return res.json({msg: "Updated!", status: true});
  } catch (ex) {
    next(ex);
  }
};

module.exports.updatePassword = async (req, res, next) => {
  const old_password = req.body.old_password;
  const new_password = req.body.new_password;
  // const confirm_password = req.body.confirm_password;
  try {
    if(new_password.length < 8) return res.json({msg: "Enter minimum 8 characters", status: false});
    const user = await User.findById({ _id: req.params.id })
    const isValid = await bcrypt.compare(old_password, user.password);

    if(!isValid){
      return res.json({msg: "Wrong Password!", status: false});
    }
    const new_hash_password = await bcrypt.hash(new_password, 10);
    await User.findByIdAndUpdate(req.params.id, {password: new_hash_password});
    res.json({msg: "Updated!", status: true});
  } catch (ex) {
    next(ex);
  }
};
module.exports.updateemail = async (req, res, next) => {
  try {
    const duplicate = await User.findOne({email: req.body.email});
    if(duplicate) return res.json({msg: "Email already exist", status: false});
    console.log(req.body.email)
    const users = await User.findByIdAndUpdate(req.params.id, {email: req.body.email}, {new: true});
    return res.json({msg: "Updated!", status: true});
  } catch (ex) {
    next(ex);
  }
};