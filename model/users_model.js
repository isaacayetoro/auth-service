const admin = require('firebase-admin');
const db = require('../database/firestore');
const Roles = require('./roles_model');
const Permissions = require('./permissions_model');

const _collectionName = 'UserIAMs';

class UserIAMs {
    
    static async addNewUser(username, email, password) {
        let exist = await this.getUserData(username);
        // if user doesn't exist, then create, else reject
        if (exist == null) {
            // check if email exists
            const userData = await this.getUserDataByEmail(email);
            if (userData != null) {
                return null;
            }
            let data = {
                username: username,
                email: email,
                password: password,
                roleIds: []
            };
            await db.collection(_collectionName).doc(username).set(data);
            // remove password
            delete data.password;
            return data;
        }
        return null;
    }

    static async getUserData(username) {
        const userRef = db.collection(_collectionName).doc(username);
        const doc = await userRef.get();
        if (!doc.exists) {
         return null;
        }
        return {
            username: doc.data().username,
            email: doc.data().email,
            password: doc.data().password,
            roleIds: doc.data().roleIds,
        };
    }

    static async addUserRoles(username, roleIds) {
        const userRef = db.collection(_collectionName).doc(username);

        const res = await userRef.update({
            roleIds: admin.firestore.FieldValue.arrayUnion(...roleIds)
        });
        return res.id;
    }

    static async getUserDataByEmail(email) {
        const userRef = db.collection(_collectionName);
        const snapshot = await userRef.where('email', '==', email).get();
        if (snapshot.empty) {
        return null;
        }
        let ret = {};
        snapshot.forEach(doc => {
            ret = doc.data();
        });
        return ret;
    }

    static async listUserRole(username) {
        const userRef = db.collection(_collectionName).doc(username);
        const doc = await userRef.get();
        if (!doc.exists) {
         return null;
        }

        let ret = [];

        for (const roleId of doc.data().roleIds) {
            const roleData = await Roles.getRole(roleId);
            if (roleData != null) {
                let permissions = [];
                for (const permissionId of roleData.permissionIds) {
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
                    roleId: roleData.roleId,
                    role: roleData.role,
                    permissions: permissions
                });
            }
        }

        return ret;
    }

    static async checkUserPermissions(username, permissionIds = []) {
        const userRef = db.collection(_collectionName).doc(username);
        const doc = await userRef.get();
        if (!doc.exists) {
            return null;
        }
        let ret = {};
        for (const permissionId of permissionIds) {
            ret[permissionId] = false;
        }
       
        let rolePermisssionIds = {};
        // go through the user roles
        for (const roleId of doc.data().roleIds) {
            const roleData = await Roles.getRole(roleId);
            
            if (roleData != null) {
                for (const permissionId of roleData.permissionIds) {
                    // get permission data
                    const permissionData = await Permissions.getPermission(permissionId);
                    if (permissionData != null) {
                        rolePermisssionIds[permissionId] = permissionData.permission;
                    }   
                }
            }
        }
        let result = [];
        for (const permissionId of permissionIds) {
            // get permission data
            const permissionData = await Permissions.getPermission(permissionId);
            result.push({
                permissionId: permissionId,
                permission: permissionData.permission == null ? null : permissionData.permission,
                allowAccess: rolePermisssionIds[permissionId] == null ? false : true
            });
        }
        return result;        
    }
}

module.exports = UserIAMs;