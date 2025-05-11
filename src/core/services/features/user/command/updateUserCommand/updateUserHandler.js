const bcrypt = require('bcrypt');
const UserMapper = require('../../../../mapping/userMapper');

class UpdateUserHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async handle(command) {
        if (!command.id) {
            throw new Error('El ID del usuario es obligatorio');
        }

        const userUpdates = {};

        if (command.email) {
            userUpdates.email = command.email;
        }

        if (command.name) {
            userUpdates.name = command.name;
        }

        if (command.lastName) {
            userUpdates.lastName = command.lastName;
        }

        if (command.role) {
            userUpdates.role = command.role;
        }

        if (command.permissions) {
            userUpdates.permissions = command.permissions;
        }

        if (command.password) {
            const hashedPassword = await bcrypt.hash(command.password, 10);
            userUpdates.password = hashedPassword;
        }

        const updatedUser = await this.userRepository.update(command.id, userUpdates);

        return UserMapper.toClient(updatedUser);
    }
}

module.exports = UpdateUserHandler;
