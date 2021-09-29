import User from "../model/User";
const userController = {

    async getUser(req,res){
        try{
            const user = await User.findOne({_id:req.user._id}).select('-password -__v -createdAt -updatedAt');
            if (!user) {
                return res.status(404).json({message:"user not found"})
            }
            res.json({user});

        } catch(err){
            return res.status(404).json({message:"user not found"});
        }
    },
    async getFriends(req,res){
        try{
            const friends = await User.find({_id:{$in:req.body}}).select('-password -__v -createdAt -updatedAt');
            
            if (!friends) {
                return res.status(404).json({message:"user not found"})
            }
            res.json({friends});
        } catch(err){
            return res.status(404).json({message:"user not found"});
        }
    },

    async searchFriend(req,res){
        console.log("currentuser",req.user._id);
        try{
            const friends = await User.find({'name': {'$regex' : `^${req.body.serachInput}`, '$options' : 'i'}, '_id': {$ne:req.user._id }}).select('-password -__v -createdAt -updatedAt');
            
            if (!friends) {
                return res.status(404).json({message:"No result found"})
            }
            res.json({friends});
        } catch(err){
            return res.status(404).json({message:"No result found"});
        }
    }

}


export default userController;