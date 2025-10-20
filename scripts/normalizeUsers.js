/*
  Script: normalizeUsers.js
  - Normaliza role a minúsculas ('admin','user','device')
  - Asigna permissions según el rol usando config/permissions.js
*/

const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { getPermissionsByRole } = require(path.resolve(__dirname, '../src/config/permissions.js'));
const User = require(path.resolve(__dirname, '../src/infrastructure/database/models/User.js'));

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/parkiu';
  await mongoose.connect(uri);
  console.log('✅ Conectado a MongoDB');

  const users = await User.find({});
  console.log(`🔎 Usuarios encontrados: ${users.length}`);

  for (const u of users) {
    const role = (u.role || 'user').toString().toLowerCase();
    const permissions = getPermissionsByRole(role);

    u.role = role;
    u.permissions = permissions;
    await u.save();

    console.log(`✔ Actualizado ${u.username} -> role=${role} permissions=${permissions.length}`);
  }

  await mongoose.disconnect();
  console.log('🏁 Listo');
}

run().catch(err => {
  console.error('❌ Error normalizando usuarios:', err);
  process.exit(1);
});
