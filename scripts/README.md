# Scripts de Utilidad para Parkiu Backend

Este directorio contiene scripts útiles para el desarrollo y prueba del backend de Parkiu.

## Crear Usuario de Prueba

El script `create-test-user.js` permite crear un usuario administrador de prueba sin necesidad de autenticación previa. Este usuario tendrá todos los permisos necesarios para usar el sistema.

### Requisitos

- Node.js instalado
- El servidor backend debe estar en ejecución (`npm run dev` o `npm start` desde el directorio raíz)

### Uso

1. Asegúrate de que el servidor backend esté en ejecución
2. Ejecuta el script:

```bash
node scripts/create-test-user.js
```

### Detalles del Usuario de Prueba

El script creará un usuario con las siguientes credenciales:

- **Username**: admin
- **Password**: admin123
- **Email**: admin@parkiu.com
- **Nombre**: Administrador
- **Apellido**: Sistema
- **Rol**: ADMIN
- **Permisos**: 
  - CAN_CREATE_USERS
  - CAN_UPDATE_USERS
  - CAN_DELETE_USERS
  - CAN_VIEW_USERS

### Notas Importantes

- Este script está diseñado solo para desarrollo y pruebas
- La ruta `/api/auth/register-test-user` debe ser eliminada o deshabilitada en producción
- Puedes modificar los datos del usuario editando el objeto `testUser` en el script

## Solución de Problemas

Si encuentras errores al ejecutar el script:

1. Verifica que el servidor backend esté en ejecución
2. Asegúrate de que la URL del servidor sea correcta (por defecto: http://localhost:3000)
3. Revisa los logs del servidor para ver si hay errores específicos
