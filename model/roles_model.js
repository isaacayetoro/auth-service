const db = require('../database/firestore');
const Permissions = require('./permissions_model');

const _collectionName = 'Roles';

class Roles {
 
    static async addNewRole(role, permissionIds = []) {

        // check if this permissions exists
        for (const permissionId of permissionIds) {
            const check = await Permissions.getPermission(permissionId);
            if (check == null) {
                throw `Permission id ${permissionId} does not exist`;
            }
        }

       db.collection(_collectionName).add({
            role: role,
            permissionIds: permissionIds || []
        });
    }

    static async listRoles() {
        let ret = [];
        const roleRef = db.collection(_collectionName);
        const snapshot = await roleRef.get();
 
        for (const doc of snapshot.docs) {
            let permissions = [];
            for (const permissionId of doc.data().permissionIds) {
                // get permission Data
                const permissionData = await Permissions.getPermission(permissionId);
                if (permissionData != null) {
                    permissions.push({
                        permissionId: permissionId,
                        permission: permissionData.permission
                    });
                }
            }

            ret.push({
                roleId: doc.id,
                role: doc.data().role,
                permissions: permissions
            });
            
        }
        return ret;
    }
    
    static async getRole(roleId) {
        const roleRef = db.collection(_collectionName).doc(roleId);
        const doc = await roleRef.get();
        if (!doc.exists) {
            return null;
        }
        return {
            roleId: doc.id,
            role: doc.data().role,
            permissionIds: doc.data().permissionIds
        };
    }
}

module.exports = Roles;