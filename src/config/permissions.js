/**
 * Sistema de permisos para Parkiu
 * Define todos los permisos disponibles y los roles que los tienen
 */

// Definición de todos los permisos del sistema
const PERMISSIONS = {
  // Usuarios
  CAN_VIEW_USERS: 'CAN_VIEW_USERS',
  CAN_CREATE_USERS: 'CAN_CREATE_USERS', 
  CAN_UPDATE_USERS: 'CAN_UPDATE_USERS',
  CAN_DELETE_USERS: 'CAN_DELETE_USERS',
  
  // Parqueaderos
  CAN_VIEW_PARKING_CELLS: 'CAN_VIEW_PARKING_CELLS',
  CAN_UPDATE_PARKING_CELLS: 'CAN_UPDATE_PARKING_CELLS',
  CAN_BULK_UPDATE_PARKING_CELLS: 'CAN_BULK_UPDATE_PARKING_CELLS',
  
  // Reservas
  CAN_CREATE_RESERVATION: 'CAN_CREATE_RESERVATION',
  CAN_CANCEL_RESERVATION: 'CAN_CANCEL_RESERVATION',
  CAN_VIEW_RESERVATIONS: 'CAN_VIEW_RESERVATIONS',
  
  // Dashboard y Reportes
  CAN_VIEW_DASHBOARD: 'CAN_VIEW_DASHBOARD',
  CAN_VIEW_RECOMMENDATIONS: 'CAN_VIEW_RECOMMENDATIONS',
  CAN_VIEW_REPORTS: 'CAN_VIEW_REPORTS',
  
  // Sistema
  CAN_VIEW_SYSTEM_STATUS: 'CAN_VIEW_SYSTEM_STATUS',
  CAN_MANAGE_SYSTEM: 'CAN_MANAGE_SYSTEM'
};

// Definición de roles y sus permisos
const ROLE_PERMISSIONS = {
  admin: [
    // Usuarios - Admin puede hacer todo
    PERMISSIONS.CAN_VIEW_USERS,
    PERMISSIONS.CAN_CREATE_USERS,
    PERMISSIONS.CAN_UPDATE_USERS,
    PERMISSIONS.CAN_DELETE_USERS,
    
    // Parqueaderos - Admin puede hacer todo
    PERMISSIONS.CAN_VIEW_PARKING_CELLS,
    PERMISSIONS.CAN_UPDATE_PARKING_CELLS,
    PERMISSIONS.CAN_BULK_UPDATE_PARKING_CELLS,
    
    // Reservas - Admin puede hacer todo
    PERMISSIONS.CAN_CREATE_RESERVATION,
    PERMISSIONS.CAN_CANCEL_RESERVATION,
    PERMISSIONS.CAN_VIEW_RESERVATIONS,
    
    // Dashboard y Reportes - Admin puede ver todo
    PERMISSIONS.CAN_VIEW_DASHBOARD,
    PERMISSIONS.CAN_VIEW_RECOMMENDATIONS,
    PERMISSIONS.CAN_VIEW_REPORTS,
    
    // Sistema - Solo admin
    PERMISSIONS.CAN_VIEW_SYSTEM_STATUS,
    PERMISSIONS.CAN_MANAGE_SYSTEM
  ],
  
  user: [
    // Parqueaderos - User puede ver y actualizar
    PERMISSIONS.CAN_VIEW_PARKING_CELLS,
    PERMISSIONS.CAN_UPDATE_PARKING_CELLS,
    
    // Reservas - User puede crear y cancelar sus propias reservas
    PERMISSIONS.CAN_CREATE_RESERVATION,
    PERMISSIONS.CAN_CANCEL_RESERVATION,
    PERMISSIONS.CAN_VIEW_RESERVATIONS,
    
    // Dashboard - User puede ver dashboard básico
    PERMISSIONS.CAN_VIEW_DASHBOARD,
    PERMISSIONS.CAN_VIEW_RECOMMENDATIONS
  ],
  
  device: [
    // Dispositivos IoT solo pueden actualizar estado de celdas
    PERMISSIONS.CAN_VIEW_PARKING_CELLS,
    PERMISSIONS.CAN_UPDATE_PARKING_CELLS,
    PERMISSIONS.CAN_BULK_UPDATE_PARKING_CELLS
  ]
};

// Función para obtener permisos por rol
const getPermissionsByRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

// Función para verificar si un rol tiene un permiso específico
const hasPermission = (role, permission) => {
  const rolePermissions = getPermissionsByRole(role);
  return rolePermissions.includes(permission);
};

// Función para obtener todos los permisos disponibles
const getAllPermissions = () => {
  return Object.values(PERMISSIONS);
};

// Función para obtener todos los roles disponibles
const getAllRoles = () => {
  return Object.keys(ROLE_PERMISSIONS);
};

module.exports = {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  getPermissionsByRole,
  hasPermission,
  getAllPermissions,
  getAllRoles
};
