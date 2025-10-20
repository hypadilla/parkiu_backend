const axios = require('axios');

// Configuración del usuario de prueba
const testUser = {
  username: 'admin1',
  password: 'admin123',
  email: 'admin@parkiu.com',
  name: 'Administrador',
  lastName: 'Sistema',
  role: 'ADMIN',
  permissions: [
    'CAN_CREATE_USERS',
    'CAN_UPDATE_USERS',
    'CAN_DELETE_USERS',
    'CAN_VIEW_USERS'
  ]
};

async function createTestUser() {
  try {
    console.log('Intentando crear usuario de prueba...');
    // Corregir la URL para incluir el prefijo /api
    const response = await axios.post('http://localhost:3000/api/auth/register-test-user', testUser);
    console.log('Usuario creado exitosamente:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario de prueba:');
    if (error.response) {
      // La solicitud fue realizada y el servidor respondió con un código de estado
      console.error('Respuesta del servidor:', error.response.data);
      console.error('Código de estado:', error.response.status);
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor. Verifica que el servidor esté en ejecución.');
    } else {
      // Ocurrió un error al configurar la solicitud
      console.error('Error:', error.message);
    }
    throw error;
  }
}

// Ejecutar la función si este script se ejecuta directamente
if (require.main === module) {
  createTestUser()
    .then(() => {
      console.log('Script completado.');
      process.exit(0);
    })
    .catch(() => {
      console.log('Script fallido.');
      process.exit(1);
    });
}

module.exports = { createTestUser };
