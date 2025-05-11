const UserMapper = require('../../../../mapping/userMapper');
const UserNotFoundError = require('../../../../../errors/userNotFoundError');

class GetUserByUsernameHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async handle(query) {
        const user = await this.userRepository.getByUsername(query.username); // Ojo: typo en "usernamme"

        if (!user) {
            throw new UserNotFoundError('Usuario no encontrado');
        }

        return UserMapper.toClient(user);
    }
}

module.exports = GetUserByUsernameHandler;
