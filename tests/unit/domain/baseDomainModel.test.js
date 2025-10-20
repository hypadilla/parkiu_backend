const BaseDomainModel = require('../../../src/core/domain/common/baseDomainModel');

describe('BaseDomainModel', () => {
  class TestModel extends BaseDomainModel {
    constructor(data) {
      super(data);
      this.customField = data.customField;
    }
  }

  describe('Constructor', () => {
    it('should create model with all base properties', () => {
      const data = {
        id: '1',
        createdDate: new Date('2023-01-01'),
        createdBy: 'admin',
        lastModifiedDate: new Date('2023-01-02'),
        lastModifiedBy: 'user',
        customField: 'test'
      };

      const model = new TestModel(data);

      expect(model.id).toBe('1');
      expect(model.createdDate).toEqual(new Date('2023-01-01'));
      expect(model.createdBy).toBe('admin');
      expect(model.lastModifiedDate).toEqual(new Date('2023-01-02'));
      expect(model.lastModifiedBy).toBe('user');
      expect(model.customField).toBe('test');
    });

    it('should create model with minimal data', () => {
      const data = {
        id: '2',
        customField: 'minimal'
      };

      const model = new TestModel(data);

      expect(model.id).toBe('2');
      expect(model.customField).toBe('minimal');
      expect(model.createdDate).toBeInstanceOf(Date);
      expect(model.lastModifiedDate).toBeInstanceOf(Date);
    });

    it('should set default dates when not provided', () => {
      const data = {
        id: '3',
        customField: 'default'
      };

      const model = new TestModel(data);

      expect(model.createdDate).toBeInstanceOf(Date);
      expect(model.lastModifiedDate).toBeInstanceOf(Date);
      expect(model.createdDate.getTime()).toBeLessThanOrEqual(Date.now());
      expect(model.lastModifiedDate.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should handle empty data object', () => {
      const data = {};

      const model = new TestModel(data);

      expect(model.id).toBeUndefined();
      expect(model.customField).toBeUndefined();
      expect(model.createdDate).toBeInstanceOf(Date);
      expect(model.lastModifiedDate).toBeInstanceOf(Date);
    });
  });

  describe('toPlainObject', () => {
    it('should return plain object with all properties', () => {
      const data = {
        id: '1',
        createdDate: new Date('2023-01-01'),
        createdBy: 'admin',
        lastModifiedDate: new Date('2023-01-02'),
        lastModifiedBy: 'user',
        customField: 'test'
      };

      const model = new TestModel(data);
      const plainObject = model.toPlainObject();

      expect(plainObject).toEqual({
        id: '1',
        createdDate: new Date('2023-01-01'),
        createdBy: 'admin',
        lastModifiedDate: new Date('2023-01-02'),
        lastModifiedBy: 'user',
        customField: 'test'
      });
    });

    it('should return plain object with undefined properties', () => {
      const data = {
        id: '2',
        customField: 'minimal'
      };

      const model = new TestModel(data);
      const plainObject = model.toPlainObject();

      expect(plainObject).toEqual({
        id: '2',
        createdDate: expect.any(Date),
        lastModifiedDate: expect.any(Date),
        customField: 'minimal'
      });
    });
  });
});
