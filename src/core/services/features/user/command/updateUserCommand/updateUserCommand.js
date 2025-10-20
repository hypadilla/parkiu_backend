class UpdateUserCommand {
    constructor(id, updateData = {}) {
        const {password, email, name, lastName, role, permissions = []} = updateData || {};
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.lastName = lastName;
        this.role = role;
        this.permissions = permissions;
    }
}

module.exports = UpdateUserCommand;
