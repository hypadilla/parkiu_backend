const User = require('../../../src/core/domain/user');

describe('User Domain Model', () => {
  describe('Constructor', () => {
    it('should create user with all properties', () => {
      const userData = {
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

      const user = new User(userData);

      expect(user.id).toBe('1');
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test');
      expect(user.lastName).toBe('User');
      expect(user.role).toBe('USER');
      expect(user.permissions).toEqual(['CAN_VIEW']);
      expect(user.createdBy).toBe('admin');
      expect(user.lastModifiedBy).toBe('user');
    });

    it('should create user with minimal data', () => {
      const userData = {
        id: '2',
        username: 'minimaluser'
      };

      const user = new User(userData);

      expect(user.id).toBe('2');
      expect(user.username).toBe('minimaluser');
      expect(user.email).toBeUndefined();
      expect(user.permissions).toEqual([]);
      expect(user.createdDate).toBeInstanceOf(Date);
      expect(user.lastModifiedDate).toBeInstanceOf(Date);
    });

    it('should set default dates when not provided', () => {
      const userData = {
        id: '3',
        username: 'defaultuser'
      };

      const user = new User(userData);

      expect(user.createdDate).toBeInstanceOf(Date);
      expect(user.lastModifiedDate).toBeInstanceOf(Date);
      expect(user.createdDate.getTime()).toBeLessThanOrEqual(Date.now());
      expect(user.lastModifiedDate.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('toPlainObject', () => {
    it('should return plain object with all properties', () => {
      const userData = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        role: 'ADMIN',
        permissions: ['CAN_VIEW', 'CAN_EDIT']
      };

      const user = new User(userData);
      const plainObject = user.toPlainObject();

      expect(plainObject).toEqual({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        lastName: 'User',
        role: 'ADMIN',
        permissions: ['CAN_VIEW', 'CAN_EDIT'],
        createdDate: expect.any(Date),
        lastModifiedDate: expect.any(Date)
      });
    });

    it('should return plain object with undefined properties', () => {
      const userData = {
        id: '2',
        username: 'minimaluser'
      };

      const user = new User(userData);
      const plainObject = user.toPlainObject();

      expect(plainObject).toEqual({
        id: '2',
        username: 'minimaluser',
        email: undefined,
        name: undefined,
        lastName: undefined,
        password: undefined,
        role: undefined,
        permissions: [],
        createdDate: expect.any(Date),
        lastModifiedDate: expect.any(Date)
      });
    });
  });
});
