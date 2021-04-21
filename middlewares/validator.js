const { validationResult } = require('express-validator');

const validator = {
    requestValidator: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());

            return res.status(401).send({
                status: 'ERROR',
                message: errors.array(),
                data: null
            });
        }
        next();
    }
};


module.exports = validator;
