const router = require('express').Router();
const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const multer = require('multer');


router.post('/register', async (req, res) => {

    //Validate the register data
    console.log(req.body);
    const {error} = registerValidation(req.body);
    console.log("out of RegisterValidation");
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    //If user already exists then don't create new user
    const Existinguser = await User.findOne({email: req.body.email});
    console.log("existing User: ",Existinguser);

    if(Existinguser){
        return res.status(400).send('Email already exists');
    } 

    //If existing user name
    const ExistingUserName = await User.findOne({userId: req.body.userId});
    if(ExistingUserName){
        return res.status(400).send('UserId already exists. Use a different username');
    }

    //Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new User to register
    const user = new User({
        userId: req.body.userId,
        email: req.body.email,
        password: hashPassword,
        profilePicName: req.body.profilePicName
    });

        //Save the created user to MongoDB
    try{
        const savedUser = await user.save();
        const token = jwt.sign(
            {id: savedUser._id},
            process.env.TOKEN_SECRET,
            { expiresIn: 3600});
       
            res.send(
                {
                    token,
                    user: {
                        id: savedUser._id,
                        userId: savedUser.userId,
                        email: savedUser.email,
                        profilePicName: savedUser.profilePicName
                    }
                }
            );
    } catch(err){
        res.status(400).send(err);
    }

});

router.post('/upload_image', function(req, res) {
    const userId = req.header('x-userId');

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, 'public');
      },
      filename: function (req, file, cb) {
          let str = file.originalname.split(".");
        cb(null, userId+'.'+str[str.length-1]);
      }
    });
    
    var upload = multer({ storage: storage }).single('file');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }

        console.log("File upload successful: ", req.file);
        return res.status(200).send(req.file.filename);
    });
});


router.post('/login', async (req, res) => {

    //Validate login details
    const {error} = loginValidation(req.body);

    if(error){
        return res.status(400).send(error.details[0].message);
    }

    //If email doesn't exist then return with error code 400 with error message
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email or password is invalid');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        return res.status(400).send('Email or password is invalid');
    }

    const token = jwt.sign(
        {id: user._id},
        process.env.TOKEN_SECRET,
        { expiresIn: 3600});
   
        res.send(
            {
                token,
                user: {
                    id: user._id,
                    userId: user.userId,
                    email: user.email,
                }
            }
        );
});

router.get('/current_user', auth, async (req, res) => {
    
    const user = await User.findById(req.user.id, {password: 0});

    if(!user) res.status(400).send({msg: 'User not found'});

    res.status(200).send(user);


});

router.post('/fetch_pic_name', auth, async (req, res) => {

    console.log("before Find call");
    console.log(req.body);
    const user = await User.findOne({userId: req.body.userId}, {password: 0});

    console.log(user);
    if(!user) res.status(400).send({msg: 'User not found'});

    res.status(200).send(user.profilePicName);

});


module.exports = router;