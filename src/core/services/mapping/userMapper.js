const User = require('../../domain/user');

class UserMapper {
    static toDomain(userDocument) {
        return new User({
            id: userDocument.id,
            createdDate: userDocument.createdDate,
            createdBy: userDocument.createdBy,
            lastModifiedDate: userDocument.lastModifiedDate,
            lastModifiedBy: userDocument.lastModifiedBy,
            username: userDocument.username,
            email: userDocument.email,
            password: userDocument.password,
            name: userDocument.name,
            lastName: userDocument.lastName,
            role: userDocument.role,
            permissions: userDocument.permissions || []
        });
    }

    static toPersistence(user) {
        return {
            createdDate: user.createdDate,
            createdBy: user.createdBy,
            lastModifiedDate: user.lastModifiedDate,
            lastModifiedBy: user.lastModifiedBy,
            username: user.username,
            email: user.email,
            password: user.password,
            name: user.name,
            lastName: user.lastName,
            role: user.role,
            permissions: user.permissions || []
        };
    }

    static toClient(user) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            role: user.role,
            permissions: user.permissions || [],
            createdDate: user.createdDate
        };
    }
}

module.exports = UserMapper;
