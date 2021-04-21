
const md5 = require('md5');
const Users = require('../model/users_model');
const authentication = require('../middlewares/auth/authenticate_user');


class UserIAMs {

    static async signup(req, res, next) {
        try {
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;

            const userData = await Users.addNewUser(username, email, md5(password));

            if (userData != null) {
                // generate the user token
                const userToken = await authentication.generateAccessToken(userData);
                res.status(200).send({
                    status: 'OK',
                    message: 'user signed up successfully',
                    data: {token: userToken},
                            
                });
            } else {
                res.status(401).send({
                    status: 'EXISTS',
                    message: 'User already exists',
                    data: null,                        
                });
            }
        } catch (error) {
            next(error);
        }
    }
    
    static async login(req, res, next) {
        try {
            const username = req.query.username;
            const email = req.query.email;
            const password = req.query.password;

            // if password is empty
            if (password == null) {
                res.status(404).send({
                    status: 'INVALID',
                    message: 'Password required',
                    data: null,
                            
                });
                
            } else if (username == null && email == null) {
                res.status(404).send({
                    status: 'INVALID',
                    message: 'username or email is required',
                    data: null,
                            
                });
            }
            else {
                let userData = null;
                if (username == null && email != null) {
                    // get userData
                    userData = await Users.getUserDataByEmail(email);
                    if (userData == null) {
                        next("Email does not exist");
                    }

                } else {
                    // get user data from the database
                    userData = await Users.getUserData(username);
                }                

                if (userData == null) {
                    res.status(401).send({
                        status: 'UNAUTHORISED',
                        message: 'User does not exist',
                        data: null,
                                
                    });
                } else {
                    // match password
                    if (userData.password == md5(password)) {
                        // remove password
                        delete userData.password;
                        // generate the user token
                        const userToken = await authentication.generateAccessToken(userData);
                        res.status(200).send({
                            status: 'OK',
                            message: 'user logged in',
                            data: {token: userToken},
                        });
                    } else {
                        res.status(200).send({
                            status: 'UNAUTHORISED',
                            message: 'Wrong password',
                            data: null,
                        });
                    }
                }
                
                
            }        
        } catch (error) {
            next(error);
        }
    }

    static async addUserRole(req, res, next) {
        try {
            const username = req.params.id;
            const roleIds = req.body.roleIds;

            // check if username exists
            const userData = await Users.getUserData(username);
            
            if (userData == null) {
                res.status(401).send({
                    status: 'INVALID',
                    message: `username ${username} not found in the database`,
                    data: null
                });
            } else {
                const result = await Users.addUserRoles(username, roleIds);
                res.status(200).send({
                    status: 'OK',
                    message: 'User Role added',
                    data: result
                });
            }            
        } catch (error) {
            next(error);
        }
    }

     static async listUserRoles(req, res, next) {
        try {
            const username = req.params.id;
            // check if username exists
            const userData = await Users.getUserData(username);
            
            if (userData == null) {
                res.status(401).send({
                    status: 'INVALID',
                    message: `username ${username} not found in the database`,
                    data: null
                });
            } else {
                const result = await Users.listUserRole(username);
                res.status(200).send({
                    status: 'OK',
                    message: 'List user roles',
                    data: result
                });
            }            
        } catch (error) {
            next(error);
        }
     }
    
    static async checkUserPermissions(req, res, next) {
        try {
            const username = req.params.id;
            const permissionIds = req.body.permissionIds;
            // check if username exists
            const userData = await Users.getUserData(username);
            
            if (userData == null) {
                res.status(401).send({
                    status: 'INVALID',
                    message: `username ${username} not found in the database`,
                    data: null
                });
            } else {
                const result = await Users.checkUserPermissions(username, permissionIds);
                res.status(200).send({
                    status: 'OK',
                    message: '',
                    data: result
                });
            }         
        } catch (error) {
            next(error);
        }
    }
}


module.exports = UserIAMs;