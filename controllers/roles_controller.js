const Roles = require('../model/roles_model');

class UserRoles {

    static async createRole(req, res, next) {
        try {
            const role = req.body.role;
            const permissionIds = req.body.permissionIds;
            await Roles.addNewRole(role, permissionIds);
            res.status(200).send({
                status: 'OK',
                message: 'Role added',
                data: { role: role, permissionIds: permissionIds }
            });
        } catch (error) {
            next(error);
        }
    }

     static async listRoles(req, res, next) {
        try {
            const roles = await Roles.listRoles();
            res.status(200).send({
                status: 'OK',
                message: 'list of roles',
                data: roles,
                        
            });
        } catch (error) {
            next(error);
        }
    }

}


module.exports = UserRoles;