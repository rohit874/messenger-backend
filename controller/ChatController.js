import Conversation from '../model/Conversation';
import User from '../model/User';
import Message from '../model/Message';

const ChatController = {
    //Store the conversation
    async Conversations(req,res,next){
        //prepare the model
        const NewConversation = new Conversation({
            members:[req.body.senderID, req.body.recieverID],
        });

        let saveConversation;
        try{
            saveConversation = await NewConversation.save();
        } catch(err){
            res.status(500).json(err)
        }
        res.status(200).json(saveConversation);
    },

    //get conversation of a user
    async getConversation(req,res){
        let getConv;
        try{
            getConv = await Conversation.find({
                members :{ $in: [ req.params.userID ]}
            });
        } catch(err){
            res.status(500).json(err)
        }

        //extract friend Ids
        const friendsIds = getConv.map((data)=>{
            return data.members.find((m) => m !== req.params.userID);
        });

        //find friend info
        let friends=[];
        try{
            friends = await User.find({_id:{$in:friendsIds}}).select('-password -__v -createdAt -updatedAt');
        } catch(err){
            return res.status(404).json({message:"user not found"});
        }

        //combine conversationID and friend info in one object
        let conversationData=[];
        friends.map((frnd,key)=>{
            let newObj={
                conversationID:getConv[key]._id,
                friendId:frnd._id,
                name:frnd.name,
                image:frnd.image
            };
            conversationData=[...conversationData,newObj];
        })
        
        res.status(200).json(conversationData);
    },

    //save message
    async saveMessage(req,res){
        const NewMessage = Message(req.body);
        let saveMessage;
        try{
            saveMessage = await NewMessage.save();

        } catch(err){
            res.status(500).json(err)
        }
        res.status(200).json(saveMessage);
    },
    
    //get Messages
    async getMessages( req, res ){
        let messages;
        try{
            messages = await Message.find({conversationId:req.params.conversationID});

        } catch(err){
            res.status(500).json(err)
        }
        res.status(200).json(messages);
    }


};

export default ChatController;