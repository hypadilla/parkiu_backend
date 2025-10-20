const DeleteUserCommand = require('../../../src/core/services/features/user/command/deleteUserCommand/deleteUserCommand');

describe('DeleteUserCommand', () => {
  describe('Constructor', () => {
    it('should create command with id', () => {
      const command = new DeleteUserCommand('1');

      expect(command.id).toBe('1');
    });

    it('should handle empty id', () => {
      const command = new DeleteUserCommand('');

      expect(command.id).toBe('');
    });

    it('should handle null id', () => {
      const command = new DeleteUserCommand(null);

      expect(command.id).toBeNull();
    });

    it('should handle undefined id', () => {
      const command = new DeleteUserCommand(undefined);

      expect(command.id).toBeUndefined();
    });

    it('should handle numeric id', () => {
      const command = new DeleteUserCommand(123);

      expect(command.id).toBe(123);
    });

    it('should handle UUID format id', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const command = new DeleteUserCommand(uuid);

      expect(command.id).toBe(uuid);
    });

    it('should handle MongoDB ObjectId format', () => {
      const objectId = '507f1f77bcf86cd799439011';
      const command = new DeleteUserCommand(objectId);

      expect(command.id).toBe(objectId);
    });

    it('should handle short id', () => {
      const shortId = '1';
      const command = new DeleteUserCommand(shortId);

      expect(command.id).toBe(shortId);
    });

    it('should handle long id', () => {
      const longId = 'a'.repeat(100);
      const command = new DeleteUserCommand(longId);

      expect(command.id).toBe(longId);
    });

    it('should handle special characters in id', () => {
      const specialId = 'id-with-special-chars!@#$%^&*()';
      const command = new DeleteUserCommand(specialId);

      expect(command.id).toBe(specialId);
    });
  });
});