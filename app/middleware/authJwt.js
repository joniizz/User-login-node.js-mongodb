const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models/index");
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    //403 Forbidden 
    if(!token) {
        return res.status(403).send({message: "No token provieded!" });
    };
    
    jwt.verify(token, config.secret, (err, decoded) => {
        //401 Unauthorized
        if(err) {
            return res.status(401).send({message: "Unauthorzied"});
        };
        req.userId = decoded.id;
        next();
    });
};

const authJwt = {
    verifyToken
}
module.exports = authJwt;

