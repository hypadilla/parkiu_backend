const User = require('../database/models/User');
const UserMapper = require('../../core/services/mapping/userMapper');

class UserRepository {
  async getByUsername(username) {
    try {
      const user = await User.findOne({ username }).lean();
      return user ? UserMapper.toDomain(user) : null;
    } catch (error) {
      throw new Error(`Error obteniendo usuario por username: ${error.message}`);
    }
  }

  async getByEmail(email) {
    try {
      const user = await User.findOne({ email }).lean();
      return user ? UserMapper.toDomain(user) : null;
    } catch (error) {
      throw new Error(`Error obteniendo usuario por email: ${error.message}`);
    }
  }

  async create(userData) {
    try {
      const user = new User(userData);
      const savedUser = await user.save();
      return UserMapper.toDomain(savedUser.toObject());
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new Error(`Usuario con este ${field} ya existe`);
      }
      throw new Error(`Error creando usuario: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const user = await User.findById(id).lean();
      return user ? UserMapper.toDomain(user) : null;
    } catch (error) {
      throw new Error(`Error obteniendo usuario por ID: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { ...updateData, lastModifiedDate: new Date() },
        { new: true, runValidators: true }
      ).lean();

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return UserMapper.toDomain(user);
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new Error(`Usuario con este ${field} ya existe`);
      }
      throw new Error(`Error actualizando usuario: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return true;
    } catch (error) {
      throw new Error(`Error eliminando usuario: ${error.message}`);
    }
  }

  async getAll(pageSize = 10, lastVisible = null) {
    try {
      let query = User.find().sort({ createdDate: -1 }).limit(pageSize);

      if (lastVisible) {
        query = query.where('_id').lt(lastVisible);
      }

      const users = await query.lean();
      const lastDoc = users[users.length - 1];

      return {
        users: users.map(user => UserMapper.toDomain(user)),
        lastVisible: lastDoc ? lastDoc._id : null
      };
    } catch (error) {
      throw new Error(`Error obteniendo usuarios: ${error.message}`);
    }
  }

  async getDocSnapshotById(id) {
    try {
      const user = await User.findById(id).lean();
      return user ? { id: user._id, ...user } : null;
    } catch (error) {
      throw new Error(`Error obteniendo snapshot de usuario: ${error.message}`);
    }
  }

  async count() {
    try {
      return await User.countDocuments();
    } catch (error) {
      throw new Error(`Error contando usuarios: ${error.message}`);
    }
  }

  async existsByUsername(username) {
    try {
      const count = await User.countDocuments({ username });
      return count > 0;
    } catch (error) {
      throw new Error(`Error verificando existencia de username: ${error.message}`);
    }
  }

  async existsByEmail(email) {
    try {
      const count = await User.countDocuments({ email });
      return count > 0;
    } catch (error) {
      throw new Error(`Error verificando existencia de email: ${error.message}`);
    }
  }
}

module.exports = UserRepository;