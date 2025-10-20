#!/bin/bash

# Script para probar el backend desplegado
# Reemplaza YOUR_RAILWAY_URL con tu URL real

RAILWAY_URL="https://tu-proyecto-production.up.railway.app"

echo "🚀 Probando Backend ParkiU en Railway..."
echo "URL: $RAILWAY_URL"
echo ""

# Test 1: Health Check
echo "1️⃣ Probando Health Check..."
curl -s "$RAILWAY_URL/api-docs" | head -5
echo ""

# Test 2: Obtener celdas de estacionamiento
echo "2️⃣ Probando endpoint de celdas..."
curl -s "$RAILWAY_URL/api/parking-cells" | head -10
echo ""

# Test 3: Dashboard
echo "3️⃣ Probando dashboard..."
curl -s "$RAILWAY_URL/api/dashboard" | head -10
echo ""

# Test 4: Recomendaciones
echo "4️⃣ Probando recomendaciones..."
curl -s "$RAILWAY_URL/api/recommendations" | head -10
echo ""

echo "✅ Pruebas completadas!"
echo "📖 Documentación API: $RAILWAY_URL/api-docs"
