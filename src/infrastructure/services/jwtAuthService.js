const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class JwtAuthService {
    constructor(secretKey, expiresIn, userRepository) {
        this.secretKey = secretKey;
        this.expiresIn = expiresIn;
        this.userRepository = userRepository;
    }

    async authenticate(credentials) {
        const { username, password } = credentials;

        const user = await this.userRepository.getByUsername(username);
        if (!user) {
            throw new Error('Authentication failed: User not found.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Authentication failed: Incorrect password.');
        }

        const token = await this.generateToken(user);
        return { user, token };
    }

    async generateToken(user) {
        return jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                email: user.email || '',
                name: user.name || '',
                lastName: user.lastName || '',
                role: user.role || 'user',
                permissions: user.permissions || [] 
            },
            this.secretKey,
            { expiresIn: this.expiresIn }
        );
    }

    async verifyToken(token) {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            throw new Error('Invalid token or token expired');
        }
    }
}

module.exports = JwtAuthService;

