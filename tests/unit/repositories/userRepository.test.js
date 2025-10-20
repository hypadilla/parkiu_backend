const UserRepository = require('../../../src/infrastructure/repositories/userRepository');
const User = require('../../../src/core/domain/user');

// Mock Firebase
const mockFirebase = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    })),
    where: jest.fn(() => ({
      get: jest.fn(),
      limit: jest.fn(() => ({
        startAfter: jest.fn(() => ({
          get: jest.fn()
        }))
      }))
    })),
    add: jest.fn(),
    limit: jest.fn(() => ({
      startAfter: jest.fn(() => ({
        get: jest.fn()
      }))
    }))
  }))
};

jest.mock('../../../src/infrastructure/database/firebaseService', () => mockFirebase);

describe('UserRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new UserRepository();
    jest.clearAllMocks();
  });

  describe('getByUsername', () => {
    it('should return user when found', async () => {
      const mockUserData = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        role: 'USER',
        permissions: ['CAN_VIEW']
      };

      const mockDoc = {
        exists: true,
        data: () => mockUserData,
        id: '1'
      };

      const mockQuerySnapshot = {
        empty: false,
        docs: [mockDoc]
      };

      mockFirebase.collection().where().get.mockResolvedValue(mockQuerySnapshot);

      const result = await repository.getByUsername('testuser');

      expect(mockFirebase.collection).toHaveBeenCalledWith('users');
      expect(result).toEqual({ id: '1', ...mockUserData });
    });

    it('should return null when user not found', async () => {
      const mockQuerySnapshot = {
        empty: true,
        docs: []
      };

      mockFirebase.collection().where().get.mockResolvedValue(mockQuerySnapshot);

      const result = await repository.getByUsername('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      mockFirebase.collection().where().get.mockRejectedValue(new Error('Database error'));

      await expect(repository.getByUsername('testuser')).rejects.toThrow('Database error');
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

      const mockDoc = {
        id: '1',
        set: jest.fn().mockResolvedValue()
      };

      mockFirebase.collection().doc.mockReturnValue(mockDoc);

      const result = await repository.create(userData);

      expect(mockFirebase.collection).toHaveBeenCalledWith('users');
      expect(mockDoc.set).toHaveBeenCalledWith(userData);
      expect(result).toEqual({ id: '1', ...userData });
    });

    it('should handle create errors', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com'
      };

      const mockDoc = {
        id: '1',
        set: jest.fn().mockRejectedValue(new Error('Create error'))
      };

      mockFirebase.collection().doc.mockReturnValue(mockDoc);

      await expect(repository.create(userData)).rejects.toThrow('Create error');
    });
  });

  describe('getById', () => {
    it('should return user when found', async () => {
      const mockUserData = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      };

      const mockDoc = {
        exists: true,
        data: () => mockUserData,
        id: '1'
      };

      mockFirebase.collection().doc().get.mockResolvedValue(mockDoc);

      const result = await repository.getById('1');

      expect(mockFirebase.collection).toHaveBeenCalledWith('users');
      expect(result).toEqual({ id: '1', ...mockUserData });
    });

    it('should return null when user not found', async () => {
      const mockDoc = {
        exists: false
      };

      mockFirebase.collection().doc().get.mockResolvedValue(mockDoc);

      const result = await repository.getById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const userData = {
        name: 'Updated',
        email: 'updated@example.com'
      };

      const mockDoc = {
        update: jest.fn().mockResolvedValue()
      };

      mockFirebase.collection().doc().get.mockResolvedValue({ exists: true });
      mockFirebase.collection().doc().update.mockResolvedValue();

      const result = await repository.update('1', userData);

      expect(mockFirebase.collection).toHaveBeenCalledWith('users');
      expect(result).toBeDefined();
    });

    it('should throw error when user not found', async () => {
      const userData = {
        name: 'Updated'
      };

      mockFirebase.collection().doc().get.mockResolvedValue({ exists: false });

      await expect(repository.update('nonexistent', userData)).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const mockDoc = {
        delete: jest.fn().mockResolvedValue()
      };

      mockFirebase.collection().doc().get.mockResolvedValue({ exists: true });
      mockFirebase.collection().doc().delete.mockResolvedValue();

      const result = await repository.delete('1');

      expect(mockFirebase.collection).toHaveBeenCalledWith('users');
      expect(result).toBe(true);
    });

    it('should throw error when user not found', async () => {
      mockFirebase.collection().doc().get.mockResolvedValue({ exists: false });

      await expect(repository.delete('nonexistent')).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: '1', username: 'user1' },
        { id: '2', username: 'user2' }
      ];

      const mockDocs = mockUsers.map(user => ({
        data: () => user,
        id: user.id
      }));

      const mockQuerySnapshot = {
        empty: false,
        docs: mockDocs
      };

      mockFirebase.collection().limit().startAfter().get.mockResolvedValue(mockQuerySnapshot);

      const result = await repository.getAll(10, null);

      expect(mockFirebase.collection).toHaveBeenCalledWith('users');
      expect(result.users).toHaveLength(2);
      expect(result.lastVisible).toBeDefined();
    });

    it('should return empty array when no users exist', async () => {
      const mockQuerySnapshot = {
        empty: true,
        docs: []
      };

      mockFirebase.collection().limit().startAfter().get.mockResolvedValue(mockQuerySnapshot);

      const result = await repository.getAll(10, null);

      expect(result.users).toHaveLength(0);
    });
  });
});
