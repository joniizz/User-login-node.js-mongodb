const config = require("../config/auth.config");
const db = require("../models/index");
const User = require("../models/user.model");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const moment = require("moment");


const MAX_ATTEMPTS = 3; // after which the account should be locked
const LOCK_WINDOW = 5; // in minutes
let lock = {
    attempts: 0,
    isLocked: false,
    unlocksAt: null,
  };
exports.signup = (req, res) => {
    bcrypt.hash(req.body.password,10).then(
        (hash) => {
            const user = new User({
                username: req.body.username,
                password: hash
            });
            //201 Created
            user.save().then(
                () => {
                    res.status(201).json({
                        message: "User added successfully!"
                    });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    );
};

exports.signin = async (req, res) => {
    User.findOne({username: req.body.username}).exec(
        (err, user) => {
            if(err) {
                res.status(500).send({ message: err});
                return;
            }

            if(!user) {
                return res.status(404).json({ message: "User not found!"});
            }
            bcrypt.compare(req.body.password, user.password).then(
                 (valid) => {
                     //const { username} = req.body;
                     try {
                        if(req.body.isLocked && req.body.lockUntil > new Date()) {
                            return res.status(401).json({
                                accessToken: null,
                                message: "Invalid password! Reached max attempts, try again after" + 
                                moment(req.body.lockUntil).fromNow(),
                            });
                        }
    
                        if (!valid) {
                            // attempt +1 very time
                            req.body.loginAttempts = req.body.loginAttempts + 1;
                            req.save;
                            //if reach 3 attempts, lock username
                            if(req.body.loginAttempts >= MAX_ATTEMPTS) {
                                var d = new Date();
                                d.setMinutes(d.getMinutes() + LOCK_WINDOW);
                                req.body.isLocked = true;
                                req.body.lockUntil = d;
                                res.json({message: "Invalid password! Reached max attempts, you account unlocks " + 
                                moment(req.body.lockUntil).fromNow()});
    
                            }
                            return res.status(401).json({
                                accessToken: null,
                                message: "Invalid password!" + req.body.loginAttempts
                                
                            });
                        }

                        var token = jwt.sign({ id: user.id}, config.secret,{
                            expiresIn: 86400 //24hrs
                        })
                        res.status(200).json({
                            message: "Signin successfully!",
                            id: user.id,
                            username: user.username,
                            accessToken: token
                        });
                     }
    
                    catch (err) {
                        console.error("Login error", err);
                        return res.status(500).json({
                        error: true,
                        message: err + " Sorry, couldn't process your request right now. Please try again later."});
                        
                }
             }
         );
        }
    
    );
};