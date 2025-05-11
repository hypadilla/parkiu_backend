const UserMapper = require('../../../../mapping/userMapper');

class GetAllUsersHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async handle(query) {
        const { pageSize = 10, lastVisible = null } = query;

        let lastVisibleDoc = null;
        if (lastVisible) {
            try {
                lastVisibleDoc = await this.userRepository.getDocSnapshotById(lastVisible);
            } catch (error) {
                throw new Error('El documento para paginación no fue encontrado');
            }
        }

        const { users, lastVisible: newLastVisible } = await this.userRepository.getAll(pageSize, lastVisibleDoc);

        return {
            users: users.map(user => UserMapper.toClient(user)),
            lastVisible: newLastVisible?.id || null,
        };
    }
}

module.exports = GetAllUsersHandler;
