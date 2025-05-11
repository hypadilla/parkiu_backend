const bcrypt = require('bcrypt');
const UserMapper = require('../../../../mapping/userMapper');

class CreateUserHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async handle(command) {
        if (!command.password) {
            throw new Error('La contraseña es obligatoria');
        }

        const hashedPassword = await bcrypt.hash(command.password, 10);

        command.password = hashedPassword;

        const user = await this.userRepository.create(command);

        return UserMapper.toClient(user);
    }
}

module.exports = CreateUserHandler;
