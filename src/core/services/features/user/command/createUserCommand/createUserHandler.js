const bcrypt = require('bcrypt');
const UserMapper = require('../../../../mapping/userMapper');
const { getPermissionsByRole } = require('../../../../../../config/permissions');

class CreateUserHandler {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async handle(command) {
        if (!command.password) {
            throw new Error('La contraseña es obligatoria');
        }

        // Asignar permisos según el rol
        const role = (command.role || 'user').toLowerCase();
        const permissions = getPermissionsByRole(role);
        
        // Asegurar que el rol esté definido
        command.role = role;
        command.permissions = permissions;

        const hashedPassword = await bcrypt.hash(command.password, 10);

        command.password = hashedPassword;

        const user = await this.userRepository.create(command);

        return UserMapper.toClient(user);
    }
}

module.exports = CreateUserHandler;
