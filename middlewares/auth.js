const jwt = require('jsonwebtoken');

function auth(req, res, next){
    const token = req.header('x-auth-token');



    //check for token
    if(!token){
         return res.status(401).send({msg: "No token, Unauthorization"});
    }

    try{
    //verify token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    //Add user from payload
    req.user = decoded;
    next();

    } catch(e){
        return res.status(400).send({msg: 'Token is not valid'});
    }
}

module.exports = auth;