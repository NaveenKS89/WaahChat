const router = require('express').Router();
const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



router.post('/register', async (req, res) => {

    //Validate the register data
    const {error} = registerValidation(req.body);

    if(error){
        return res.status(400).send(error.details[0].message);
    }

    //If user already exists then don't create new user
    const Existinguser = await User.findOne({email: req.body.email});

    if(Existinguser){
        return res.status(400).send('Email already exists');
    }

    //Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new User for register
    const user = new User({
        userId: req.body.userId,
        email: req.body.email,
        password: hashPassword
    });

    console.log("Just before saving user")
    //Save the created user to MongoDB
    try {
        const savedUser = await user.save();
        res.send({user: savedUser._id});
    } catch(err){
        res.status(400).send(err);
    }
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

    //Create and assign a token
    const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

});


module.exports = router;