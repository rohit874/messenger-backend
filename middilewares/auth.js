import JwtService from '../services/JwtService';
const auth = async (req,res,next) =>{

    let authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({message:"unAuthorized"});
    }
    const token  = authHeader.split(' ')[1];

    try{
        const { _id, email } = await JwtService.verify(token);
        const user = {
            _id,
            email
        };
        req.user = user;
        next();

    }catch(err){
        return res.status(401).json({message:"unAuthorized"});
    }
}

export default auth;