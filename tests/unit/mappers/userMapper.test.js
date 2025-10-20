const UserMapper = require('../../../src/core/services/mapping/userMapper');
const User = require('../../../src/core/domain/user');

describe('UserMapper', () => {
  describe('toDomain', () => {
    it('should map document to domain object', () => {
      const document = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        role: 'USER',
        permissions: ['CAN_VIEW'],
        createdDate: new Date('2023-01-01'),
        createdBy: 'admin',
        lastModifiedDate: new Date('2023-01-02'),
        lastModifiedBy: 'user'
      };

      const user = UserMapper.toDomain(document);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe('1');
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test');
      expect(user.lastName).toBe('User');
      expect(user.role).toBe('USER');
      expect(user.permissions).toEqual(['CAN_VIEW']);
    });

    it('should handle null input', () => {
      const result = UserMapper.toDomain(null);
      expect(result).toBeNull();
    });

    it('should handle undefined input', () => {
      const result = UserMapper.toDomain(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('toPersistence', () => {
    it('should map domain object to persistence format', () => {
      const user = new User({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        role: 'USER',
        permissions: ['CAN_VIEW'],
        createdDate: new Date('2023-01-01'),
        createdBy: 'admin',
        lastModifiedDate: new Date('2023-01-02'),
        lastModifiedBy: 'user'
      });

      const persistenceData = UserMapper.toPersistence(user);

      expect(persistenceData).toEqual({
        createdDate: user.createdDate,
        createdBy: 'admin',
        lastModifiedDate: user.lastModifiedDate,
        lastModifiedBy: 'user',
        username: 'testuser',
        email: 'test@example.com',
        password: undefined,
        name: 'Test',
        lastName: 'User',
        role: 'USER',
        permissions: ['CAN_VIEW']
      });
    });

    it('should handle user with empty permissions', () => {
      const user = new User({
        id: '2',
        username: 'nopermissions',
        email: 'no@example.com'
      });

      const persistenceData = UserMapper.toPersistence(user);

      expect(persistenceData.permissions).toEqual([]);
    });
  });

  describe('toClient', () => {
    it('should map domain object to client format', () => {
      const user = new User({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        role: 'USER',
        permissions: ['CAN_VIEW']
      });

      const clientData = UserMapper.toClient(user);

      expect(clientData).toEqual({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        role: 'USER',
        permissions: ['CAN_VIEW']
      });
    });

    it('should handle user with minimal data', () => {
      const user = new User({
        id: '2',
        username: 'minimaluser'
      });

      const clientData = UserMapper.toClient(user);

      expect(clientData).toEqual({
        id: '2',
        username: 'minimaluser',
        email: undefined,
        name: undefined,
        lastName: undefined,
        role: undefined,
        permissions: []
      });
    });

    it('should handle null input', () => {
      const result = UserMapper.toClient(null);
      expect(result).toBeNull();
    });

    it('should handle undefined input', () => {
      const result = UserMapper.toClient(undefined);
      expect(result).toBeUndefined();
    });
  });
});
