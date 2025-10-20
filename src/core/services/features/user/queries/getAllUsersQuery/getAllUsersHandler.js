const UserMapper = require('../../../../mapping/userMapper');

class GetAllUsersHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async handle(query) {
        const { pageSize = 10, lastVisible = null } = query;

        const { users, lastVisible: newLastVisible } = await this.userRepository.getAll(pageSize, lastVisible);

        return {
            users: users.map(user => UserMapper.toClient(user)),
            lastVisible: newLastVisible || null,
        };
    }
}

module.exports = GetAllUsersHandler;
