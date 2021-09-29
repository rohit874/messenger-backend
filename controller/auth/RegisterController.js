import User from "../../model/User";
import Joi from "joi";
import JwtService from '../../services/JwtService'; 
import bcrypt from 'bcryptjs'
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    },
}); 
  
const handleMultipartData = multer({
    storage,
    limits: { fileSize: 1000000 * 5 },
}).single('image'); // 5mb


const registerController = {

    async register(req, res, next) {
        handleMultipartData(req, res, async (err) => {
           if (err) {
                return res.status(500).json(err)
            }

            let filePath;

            if (req.file==null) {
                filePath = "images/noProfilepic.jpg";
            }
            else{
                filePath = req.file.path;
            }
   
        //validation
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            image: Joi.string(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        });

        const {error} = registerSchema.validate(req.body);
        
        if (error) {
            // Delete the uploaded file
            if (req.file!=null) {
                fs.unlink(`${path.resolve("./")}/${filePath}`, (err) => {
                    if (err) {
                        return res.status(409).json({message:"error while delete file"})
                    }
                });
            }
           
            return res.status(409).json({message:error.message})
        }

        //check if already exist
        try{
            const exist = await User.exists({email:req.body.email});
            if (exist) {

            // Delete the uploaded file
            if (req.file!=null) {
                fs.unlink(`${path.resolve("./")}/${filePath}`, (err) => {
                    if (err) {
                        return res.status(409).json({message:"error while delete file"})
                    }
                });
            }

                return res.status(409).json({message:"user already exist"})
            }

        } catch(err){
            return res.status(404).json({message:"404 not found"})
        }

        const  {name, email, password } = req.body;
        //hash Password
        const hashedPassword = await bcrypt.hash(password,10);

        //prepare the model
        const user = new User({
            name,
            email,
            image:filePath,
            password: hashedPassword
        });

        let access_token;
        // let refresh_token;

        try{
            const result = await user.save();
            console.log(result);
            //token
            access_token = JwtService.sign({_id: result._id, email: result.email});
            // refresh_token = JwtService.sign({_id: result._id, email: result.email},'1y',REFRESH_SECRET);

            //store refreshToken in database
            // await Refreshtoken.create({token:refresh_token});

        }catch(err){
            return res.status(404).json({message:"404 not found"})
        }
        res.json({ access_token});
    });
    }
}

export default registerController
