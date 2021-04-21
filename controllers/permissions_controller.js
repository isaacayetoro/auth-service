const Permissions = require('../model/permissions_model');

class UserPermissions {

    static async createPermission(req, res, next) {

        try {
            const permission = req.body.permission;
            await Permissions.addNewpermission(permission);
            res.status(200).send({
                status: 'OK',
                message: 'Permission added',
                data: { permission: permission },
                        
            });
        } catch (error) {
            next(error);
        }
    }

     static async listPermissions(req, res, next) {
         try {
             const ret = await Permissions.listPermissions();
            res.status(200).send({
                status: 'OK',
                message: 'List of permissions',
                data: ret,
            });
        } catch (error) {
            next(error);
        }
    }

}


module.exports = UserPermissions;