const User = require("../models/userModel.js");


module.exports.findFriends = async(req, res, next) => {
    const cur_user = req.params.cur_user;
  
    try {
        const friends = await User.findById(cur_user)
        const result = await User.find({_id: {$in: friends.friends}});
    
        res.status(200).json(result);
    } catch (error) {
      next(error)
    }
}

module.exports.findRequest = async(req, res, next) => {
    const cur_user = req.params.cur_user;
  
    try {
        const request = await User.findById(cur_user)
        const result = await User.find({_id: {$in: request.request}});
    
        res.status(200).json(result);
    } catch (error) {
      next(error)
    }
}

module.exports.sendReq = async(req, res, next) => {
    const cur_user = req.params.cur_user;
    const user = req.params.user;

    try {
        const result = await User.findByIdAndUpdate(user,{$addToSet: {request: cur_user}},{new: true})

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

module.exports.acceptReq = async(req, res, next) => {
    const cur_user = req.params.cur_user;
    const user = req.params.user;
    try {
        await User.findByIdAndUpdate(cur_user, {$pull: {request: user}});
        await User.findByIdAndUpdate(user, {$push: {friends: cur_user}});

        const result = await User.findByIdAndUpdate(cur_user, {$push: {friends: user}},{new: true});

        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

module.exports.rejectReq = async(req, res, next) => {
    const cur_user = req.params.cur_user;
    const user = req.params.user;
    try {
        const result = await User.findByIdAndUpdate(cur_user, {$pull: {request: user}});

        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}