const db = require('../database/firestore');

const _collectionName = 'Permissions';

class Permissions {

    static async addNewpermission(permission) {
        db.collection(_collectionName).add({
            permission: permission,
        });
    }

    static async listPermissions() {
        let ret = [];
        const permissionRef = db.collection(_collectionName);
        const snapshot = await permissionRef.get();
        snapshot.forEach(doc => {
            ret.push({
                permissionId: doc.id,
                permission: doc.data().permission
            });
        });
        return ret;
    }
    
    static async getPermission(permissionId) {
        const permissionRef = db.collection(_collectionName).doc(permissionId);
        const doc = await permissionRef.get();
        if (!doc.exists) {
            return null;
        }
        return doc.data();
    }
}

module.exports = Permissions;