class UserAlreadyExistsError extends Error {
    constructor(field) {
        super(`A user with this ${field} already exists`);
        this.name = 'UserAlreadyExistsError';
        this.field = field;
    }
}

module.exports = UserAlreadyExistsError;
