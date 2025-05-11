class CreateUserCommand {
    constructor({username, password, email, name, lastName, role, permissions = []}) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.name = name;
        this.lastName = lastName;
        this.role = role;
        this.permissions = permissions;
    }
}

module.exports = CreateUserCommand;
