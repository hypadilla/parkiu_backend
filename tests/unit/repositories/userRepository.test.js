const UserRepository = require('../../../src/infrastructure/repositories/userRepository');
const UserDomain = require('../../../src/core/domain/user');
const UserMapper = require('../../../src/core/services/mapping/userMapper');

// Mock the User model
const mockUserInstance = {
  save: jest.fn(),
  toObject: jest.fn()
};

jest.mock('../../../src/infrastructure/database/models/User', () => {
  const mockConstructor = jest.fn(() => mockUserInstance);
  mockConstructor.findById = jest.fn();
  mockConstructor.findOne = jest.fn();
  mockConstructor.create = jest.fn();
  mockConstructor.findByIdAndUpdate = jest.fn();
  mockConstructor.findByIdAndDelete = jest.fn();
  mockConstructor.find = jest.fn().mockReturnThis();
  mockConstructor.sort = jest.fn().mockReturnThis();
  mockConstructor.limit = jest.fn().mockReturnThis();
  mockConstructor.lean = jest.fn();
  mockConstructor.countDocuments = jest.fn();
  return mockConstructor;
});

const User = require('../../../src/infrastructure/database/models/User');

describe('UserRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new UserRepository();
    jest.clearAllMocks();
  });

  describe('getByUsername', () => {
    it('should return user when found', async () => {
      const mockUserData = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        role: 'USER',
        permissions: ['CAN_VIEW']
      };

      User.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUserData)
      });

      const result = await repository.getByUsername('testuser');

      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(result).toEqual(expect.objectContaining({
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        role: 'USER',
        permissions: ['CAN_VIEW']
      }));
    });

    it('should return null when user not found', async () => {
      User.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });

      const result = await repository.getByUsername('nonexistent');

      expect(User.findOne).toHaveBeenCalledWith({ username: 'nonexistent' });
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      User.findOne.mockReturnValue({
        lean: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      await expect(repository.getByUsername('testuser')).rejects.toThrow('Database error');
    });
  });

  describe('getByEmail', () => {
    it('should return user when found', async () => {
      const mockUserData = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com'
      };

      User.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUserData)
      });

      const result = await repository.getByEmail('test@example.com');

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      // Evitar comparaciones de fechas frágiles
      const expectedUser = UserMapper.toDomain(mockUserData);
      expect(result).toEqual(expect.objectContaining({
        username: expectedUser.username,
        email: expectedUser.email,
        name: expectedUser.name,
        lastName: expectedUser.lastName,
        password: expectedUser.password,
        permissions: expectedUser.permissions || []
      }));
    });
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'hashedpassword',
        name: 'New',
        lastName: 'User'
      };

      const mockCreatedUser = {
        _id: '507f1f77bcf86cd799439011',
        ...userData
      };

      // Mock the constructor and instance methods
      const savedUser = {
        ...mockCreatedUser,
        toObject: jest.fn().mockReturnValue(mockCreatedUser)
      };
      mockUserInstance.save.mockResolvedValue(savedUser);

      const result = await repository.create(userData);

      expect(User).toHaveBeenCalledWith(userData);
      expect(mockUserInstance.save).toHaveBeenCalled();
      // Avoid asserting exact timestamps to prevent flakiness
      const expectedUser = UserMapper.toDomain(mockCreatedUser);
      expect(result).toEqual(expect.objectContaining({
        username: expectedUser.username,
        email: expectedUser.email,
        name: expectedUser.name,
        lastName: expectedUser.lastName,
        password: expectedUser.password,
        permissions: expectedUser.permissions || []
      }));
    });

    it('should handle duplicate key error', async () => {
      const userData = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password'
      };

      const error = new Error('Duplicate key error');
      error.code = 11000;
      error.keyPattern = { username: 1 };

      mockUserInstance.save.mockRejectedValue(error);

      await expect(repository.create(userData)).rejects.toThrow('Usuario con este username ya existe');
    });

    it('should handle create errors', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com'
        // Missing password
      };

      mockUserInstance.save.mockRejectedValue(new Error('User validation failed: password: Path `password` is required.'));

      await expect(repository.create(userData)).rejects.toThrow('Error creando usuario: User validation failed: password: Path `password` is required.');
    });
  });

  describe('getById', () => {
    it('should return user when found', async () => {
      const mockUserData = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com'
      };

      User.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUserData)
      });

      const result = await repository.getById('507f1f77bcf86cd799439011');

      expect(User.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(UserMapper.toDomain(mockUserData));
    });

    it('should return null when user not found', async () => {
      User.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });

      const result = await repository.getById('507f1f77bcf86cd799439011');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updateData = {
        name: 'Updated',
        email: 'updated@example.com'
      };

      const mockUpdatedUser = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        ...updateData
      };

      User.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUpdatedUser)
      });

      const result = await repository.update('507f1f77bcf86cd799439011', updateData);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { ...updateData, lastModifiedDate: expect.any(Date) },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(expect.objectContaining({
        username: 'testuser',
        name: 'Updated',
        email: 'updated@example.com'
      }));
    });

    it('should throw error when user not found', async () => {
      User.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });

      await expect(repository.update('507f1f77bcf86cd799439011', { name: 'Updated' }))
        .rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const mockDeletedUser = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser'
      };

      User.findByIdAndDelete.mockResolvedValue(mockDeletedUser);

      const result = await repository.delete('507f1f77bcf86cd799439011');

      expect(User.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toBe(true);
    });

    it('should throw error when user not found', async () => {
      User.findByIdAndDelete.mockResolvedValue(null);

      await expect(repository.delete('507f1f77bcf86cd799439011'))
        .rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('getAll', () => {
    it('should return all users with pagination', async () => {
      const mockUsers = [
        { _id: '507f1f77bcf86cd799439011', username: 'user1', email: 'user1@example.com' },
        { _id: '507f1f77bcf86cd799439012', username: 'user2', email: 'user2@example.com' }
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUsers)
      };

      User.find.mockReturnValue(mockQuery);

      const result = await repository.getAll(10, null);

      expect(User.find).toHaveBeenCalled();
      expect(result.users).toHaveLength(2);
      // Evitar comparaciones de fechas frágiles
      const expectedUser = UserMapper.toDomain(mockUsers[0]);
      expect(result.users[0]).toEqual(expect.objectContaining({
        username: expectedUser.username,
        email: expectedUser.email,
        name: expectedUser.name,
        lastName: expectedUser.lastName,
        password: expectedUser.password,
        permissions: expectedUser.permissions || []
      }));
    });

    it('should return empty array when no users exist', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      };

      User.find.mockReturnValue(mockQuery);

      const result = await repository.getAll(10, null);

      expect(result.users).toHaveLength(0);
    });
  });

  describe('existsByUsername', () => {
    it('should return true when username exists', async () => {
      User.countDocuments.mockResolvedValue(1);

      const result = await repository.existsByUsername('existinguser');

      expect(User.countDocuments).toHaveBeenCalledWith({ username: 'existinguser' });
      expect(result).toBe(true);
    });

    it('should return false when username does not exist', async () => {
      User.countDocuments.mockResolvedValue(0);

      const result = await repository.existsByUsername('nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('existsByEmail', () => {
    it('should return true when email exists', async () => {
      User.countDocuments.mockResolvedValue(1);

      const result = await repository.existsByEmail('existing@example.com');

      expect(User.countDocuments).toHaveBeenCalledWith({ email: 'existing@example.com' });
      expect(result).toBe(true);
    });
  });
});