const BaseDomainModel = require('./common/baseDomainModel');

class User extends BaseDomainModel {
    constructor({
        id,
        createdDate,
        createdBy,
        lastModifiedDate,
        lastModifiedBy,
        username,
        email,
        name,
        password,
        lastName,
        role,
        permissions = []
    }) {
        super({ id, createdDate, createdBy, lastModifiedDate, lastModifiedBy });
        this.username = username;
        this.email = email;
        this.name = name;
        this.password = password;
        this.lastName = lastName;
        this.role = role;
        this.permissions = permissions;
    }
}

module.exports = User;
