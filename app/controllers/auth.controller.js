const config = require("../config/auth.config");
const db = require("../models/index");
const User = require("../models/user.model");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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

exports.signin = (req, res) => {
    User.findOne({username: req.body.username}).then(
        (user) => {
            if(!user) {
                return res.status(401).json({
                    error: new Error("User not found!")
                });
            }
            bcrypt.compare(req.body.password, user.password).then(
                (valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: new error("Incorrect password!")
                        });
                    }
                    var token = jwt.sign({ id: user.id}, config.secret,{
                        expiresIn: 86400 //24hrs
                    })
                    res.status(200).json({
                        id: user.id,
                        username: user.username,
                        accessToken: token
                    });
                }
            );
        }
    );
};