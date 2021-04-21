
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// get config vars
dotenv.config();


const authentication = {
    /**
     * @param userData
     * @returns {String}
     */
    generateAccessToken: (userData) => {
        return new Promise((success, reject) => {
            try {
                // token expires in 30 mins
                const userToken = jwt.sign({ data: userData, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, process.env.TOKEN_SECRET,);
            success(userToken);
            } catch (error) {
                reject(error);
            }
        });
    },

    /**
     * 
     */
    authenticateToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) {
            res.status(401).send({
                status: 'UNAUTHENTICATED',
                message: 'Invalid access token',
                data: null,
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET, (err, userData) => {
            if (err) {
                // console.log(err);
                res.status(401).send({
                    status: 'UNAUTHENTICATED',
                    message: err,
                    data: null,
                });
            } else {
                req.userData = userData;
                next();
            }
            
        });
    }
}

module.exports = authentication;
