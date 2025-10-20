const UpdateUserCommand = require('../../../src/core/services/features/user/command/updateUserCommand/updateUserCommand');

describe('UpdateUserCommand', () => {
  describe('Constructor', () => {
    it('should create command with id and update data', () => {
      const id = '1';
      const updateData = {
        name: 'Updated',
        email: 'updated@example.com',
        password: 'newpassword123'
      };

      const command = new UpdateUserCommand(id, updateData);

      expect(command.id).toBe('1');
      expect(command.updateData).toEqual(updateData);
    });

    it('should create command with minimal update data', () => {
      const id = '2';
      const updateData = {
        name: 'Updated'
      };

      const command = new UpdateUserCommand(id, updateData);

      expect(command.id).toBe('2');
      expect(command.updateData).toEqual(updateData);
    });

    it('should handle empty update data', () => {
      const id = '3';
      const updateData = {};

      const command = new UpdateUserCommand(id, updateData);

      expect(command.id).toBe('3');
      expect(command.updateData).toEqual({});
    });

    it('should handle null update data', () => {
      const id = '4';
      const updateData = null;

      const command = new UpdateUserCommand(id, updateData);

      expect(command.id).toBe('4');
      expect(command.updateData).toBeNull();
    });
  });
});
