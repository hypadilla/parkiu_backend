const db = require('../database/firebaseService');
const UserMapper = require('../../core/services/mapping/userMapper');
const UserAlreadyExistsError = require('../../core/errors/userAlreadyExistsError');

class UserRepository {
    constructor() {
        this.collection = db.collection('users');
    }

    async create(user) {
        try {
            const usernameSnap = await this.collection.where('username', '==', user.username).limit(1).get();
            if (!usernameSnap.empty) {
                throw new UserAlreadyExistsError('username');
            }

            const emailSnap = await this.collection.where('email', '==', user.email).limit(1).get();
            if (!emailSnap.empty) {
                throw new UserAlreadyExistsError('email');  
            }

            const userData = UserMapper.toPersistence(user);
            const now = new Date();
            userData.createdDate = now;
            userData.lastModifiedDate = now;
            userData.createdBy = userData.createdBy || 'system';
            userData.lastModifiedBy = userData.lastModifiedBy || 'system';

            const docRef = await this.collection.add(userData);
            return UserMapper.toDomain({ id: docRef.id, ...userData });
        } catch (error) {
            throw error;
        }
    }

    async getById(id) {
        try {
            const doc = await this.collection.doc(id).get();
            if (!doc.exists) return null;
            return UserMapper.toDomain({ id: doc.id, ...doc.data() });
        } catch (error) {
            throw error;
        }
    }

    async getByUsername(username) {
        try {
            const snapshot = await this.collection.where('username', '==', username).limit(1).get();
            if (snapshot.empty) return null;

            const doc = snapshot.docs[0];
            return UserMapper.toDomain({ id: doc.id, ...doc.data() });
        } catch (error) {
            throw error;
        }
    }

    async update(id, userUpdates) {
        try {
            const userRef = this.collection.doc(id);
            const doc = await userRef.get();

            if (!doc.exists) {
                throw new Error('User not found');
            }

            const dataToUpdate = {};

            if (userUpdates.email) dataToUpdate.email = userUpdates.email;
            if (userUpdates.name) dataToUpdate.name = userUpdates.name;
            if (userUpdates.lastName) dataToUpdate.lastName = userUpdates.lastName;
            if (userUpdates.role) dataToUpdate.role = userUpdates.role;
            if (userUpdates.permissions) dataToUpdate.permissions = userUpdates.permissions;
            if (userUpdates.password) dataToUpdate.password = userUpdates.password;
            
            dataToUpdate.lastModifiedDate = new Date();
            dataToUpdate.lastModifiedBy = userUpdates.lastModifiedBy || 'system';

            delete dataToUpdate.createdDate;
            delete dataToUpdate.createdBy;

            await userRef.update(dataToUpdate);

            const updatedDoc = await userRef.get();

            return UserMapper.toDomain({ id: updatedDoc.id, ...updatedDoc.data() });
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const docRef = this.collection.doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                throw new Error('User not found');
            }

            await docRef.delete();
            return true;
        } catch (error) {
            throw error;
        }
    }

    async getAll(pageSize = 10, lastVisible = null) {
        try {
            let query = this.collection.orderBy('createdDate').limit(pageSize);

            if (lastVisible) {
                query = query.startAfter(lastVisible);
            }

            const snapshot = await query.get();

            if (snapshot.empty) {
                return {
                    users: [],
                    lastVisible: null
                };
            }

            const users = snapshot.docs.map(doc => UserMapper.toDomain({ id: doc.id, ...doc.data() }));

            const lastDoc = snapshot.docs[snapshot.docs.length - 1];

            return {
                users,
                lastVisible: lastDoc
            };
        } catch (error) {
            throw error;
        }
    }

    async getDocSnapshotById(id) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new Error('No se encontró el documento con el ID proporcionado');
        }
        return doc;
    }

}

module.exports = UserRepository;
