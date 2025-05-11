class DeleteUserHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async handle(command) {
        const isDelete = await this.userRepository.delete(command.id);

        return isDelete;
    }
}

module.exports = DeleteUserHandler;
