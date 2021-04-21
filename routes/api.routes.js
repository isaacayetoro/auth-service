const express = require('express');
const { check, checkSchema } = require("express-validator");
// const swaggerJsDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
// const swaggerOptions = require("../swagger.json");
// const swaggerDocs = swaggerJsDoc(swaggerOptions);

const userIAM = require('../controllers/users_controller');
const userIAMPermissions = require('../controllers/permissions_controller');
const userIAMRoles = require('../controllers/roles_controller');
const authentication = require('../middlewares/auth/authenticate_user');
const validator = require('../middlewares/validator');

// instantiate Router class
const router = express.Router();

// //setup swagger documentation
// router.use("/api-docs", swaggerUi.serve);
// router.get("/api-docs", swaggerUi.setup(swaggerDocs));


/** A user can be signed up with a username, password and an email */
router.post(
  "/signup",
  [
    check("email").exists().withMessage("`email` is required"),
    check("email").isEmail().withMessage("Invalid email address"),
    check("password").exists().withMessage("`password` is required"),
    check("username").exists().withMessage("`username` is required"),
    check("username").isLength({ min: 5, max: 10 }).withMessage("`username` can have min 5 characters and max 10 characters"),
    check("username").isAlphanumeric().withMessage("`username` must be alphanumeric"),
  ],
  validator.requestValidator,
  userIAM.signup
);

/** A user can be logged in with username, password or email, password combo */
router.get(
  "/login",
  [
    check("password").exists().withMessage("`password` is required"),
  ],
  validator.requestValidator,
  userIAM.login
);

/** Permissions */

/** create a new permission */
router.post(
  "/permissions",
  authentication.authenticateToken,
    userIAMPermissions.createPermission    
);

/** get available permissions */
router.get(
  "/permissions",
  authentication.authenticateToken,
    userIAMPermissions.listPermissions
);

/** Roles */

/** create a new role with a certain permission */
router.post(
  "/roles",
  authentication.authenticateToken,
    userIAMRoles.createRole   
);

/** get available roles with role-ids */
router.get(
  "/roles",
  authentication.authenticateToken,
    userIAMRoles.listRoles
);

/** USER ROLES */

/**  can add a list of roles to the user */
router.post(
  "/users/:id/roles",
  authentication.authenticateToken,
    userIAM.addUserRole
);


/** get list of roles added to the user */
router.get(
  "/users/:id/roles",
  authentication.authenticateToken,
    userIAM.listUserRoles
);

/** sent with set of permission ids- will return which are allowed and which
are not allowed for the user */
router.post(
  "/users/:id/permissions",
  authentication.authenticateToken,
    userIAM.checkUserPermissions
);

module.exports = router;
