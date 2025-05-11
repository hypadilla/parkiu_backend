const UserMapper = require('../../../../mapping/userMapper');
const UserNotFoundError = require('../../../../../errors/userNotFoundError');

class GetUserByIdHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async handle(query) {
        const user = await this.userRepository.getById(query.id);

        if (!user) {
            throw new UserNotFoundError('Usuario no encontrado');
        }

        return UserMapper.toClient(user);
    }
}

module.exports = GetUserByIdHandler;
