class LogoutUserHandler {
    constructor(tokenBlacklist) {
        this.tokenBlacklist = tokenBlacklist;
    }

    async handle(command) {
        this.tokenBlacklist.add(command.token);
        return { message: 'Logged out successfully' };
    }
}

module.exports = LogoutUserHandler;
