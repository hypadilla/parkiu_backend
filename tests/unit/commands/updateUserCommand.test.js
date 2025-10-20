const UpdateUserCommand = require('../../../src/core/services/features/user/command/updateUserCommand/updateUserCommand');

describe('UpdateUserCommand', () => {
  describe('Constructor', () => {
    it('should create command with all properties', () => {
      const command = new UpdateUserCommand('1', {
        email: 'updated@example.com',
        password: 'newpassword123',
        name: 'Updated',
        lastName: 'User',
        role: 'admin',
        permissions: ['manage_users', 'view_reports']
      });

      expect(command.id).toBe('1');
      expect(command.email).toBe('updated@example.com');
      expect(command.password).toBe('newpassword123');
      expect(command.name).toBe('Updated');
      expect(command.lastName).toBe('User');
      expect(command.role).toBe('admin');
      expect(command.permissions).toEqual(['manage_users', 'view_reports']);
    });

    it('should create command with partial properties', () => {
      const command = new UpdateUserCommand('1', {
        email: 'updated@example.com',
        name: 'Updated'
      });

      expect(command.id).toBe('1');
      expect(command.email).toBe('updated@example.com');
      expect(command.password).toBeUndefined();
      expect(command.name).toBe('Updated');
      expect(command.lastName).toBeUndefined();
      expect(command.role).toBeUndefined();
      expect(command.permissions).toEqual([]);
    });

    it('should handle empty update data', () => {
      const command = new UpdateUserCommand('1', {});

      expect(command.id).toBe('1');
      expect(command.email).toBeUndefined();
      expect(command.password).toBeUndefined();
      expect(command.name).toBeUndefined();
      expect(command.lastName).toBeUndefined();
      expect(command.role).toBeUndefined();
      expect(command.permissions).toEqual([]);
    });

    it('should handle null update data', () => {
      const command = new UpdateUserCommand('1', null);

      expect(command.id).toBe('1');
      expect(command.email).toBeUndefined();
      expect(command.password).toBeUndefined();
      expect(command.name).toBeUndefined();
      expect(command.lastName).toBeUndefined();
      expect(command.role).toBeUndefined();
      expect(command.permissions).toEqual([]);
    });

    it('should handle undefined update data', () => {
      const command = new UpdateUserCommand('1', undefined);

      expect(command.id).toBe('1');
      expect(command.email).toBeUndefined();
      expect(command.password).toBeUndefined();
      expect(command.name).toBeUndefined();
      expect(command.lastName).toBeUndefined();
      expect(command.role).toBeUndefined();
      expect(command.permissions).toEqual([]);
    });

    it('should handle custom permissions', () => {
      const command = new UpdateUserCommand('1', {
        permissions: ['custom_permission1', 'custom_permission2']
      });

      expect(command.permissions).toEqual(['custom_permission1', 'custom_permission2']);
    });

    it('should handle empty permissions array', () => {
      const command = new UpdateUserCommand('1', {
        permissions: []
      });

      expect(command.permissions).toEqual([]);
    });

    it('should handle null permissions', () => {
      const command = new UpdateUserCommand('1', {
        permissions: null
      });

      expect(command.permissions).toBeNull();
    });

    it('should handle undefined permissions', () => {
      const command = new UpdateUserCommand('1', {
        permissions: undefined
      });

      expect(command.permissions).toEqual([]);
    });
  });
});