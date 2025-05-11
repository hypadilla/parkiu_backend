class VerifyTokenHandler {
    constructor(authService) {
        this.authService = authService;
    }

    async handle(query) {
        return await this.authService.verifyToken(query.token);
    }
}

module.exports = VerifyTokenHandler;