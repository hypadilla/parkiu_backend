const { server, initializeApp } = require('./src/adapters/app');
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Inicializar aplicación (MongoDB + WebSockets)
    await initializeApp();
    
    // Iniciar servidor
    server.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`📚 Documentación disponible en http://localhost:${PORT}/api-docs`);
      console.log(`🔌 WebSocket disponible en ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

startServer();
