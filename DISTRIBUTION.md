# LifeHub Pro - Guía de Distribución

## 📱 Información de la App

- **Nombre**: LifeHub Pro
- **Versión**: 1.0.1
- **Bundle ID**: com.lifehub.pro
- **Package Name**: com.lifehub.pro

## 🚀 Build de Producción

### Prerrequisitos

1. Tener cuenta de Expo (para builds en la nube)
2. Tener cuenta de Apple Developer (para iOS)
3. Tener cuenta de Google Play Console (para Android)

### Build Local

```bash
# Build para Android
npm run build:android

# Build para iOS
npm run build:ios

# Build para todas las plataformas
npm run build:all
```

### Build en la Nube (Recomendado)

```bash
# Login en Expo
npx expo login

# Build Android
npx expo build:android

# Build iOS
npx expo build:ios
```

## 📦 Distribución

### Android

1. **APK**: El archivo se genera en `dist/` después del build
2. **Google Play Store**: Subir APK o AAB a Google Play Console
3. **Testing**: Compartir APK directamente para testing

### iOS

1. **TestFlight**: Usar Transporter para subir a App Store Connect
2. **App Store**: Proceso de review de Apple
3. **Testing**: Invitar usuarios a TestFlight

## 🔧 Configuración de Producción

### Variables de Entorno

- `API_URL`: https://lifehub-api.onrender.com
- `JWT_SECRET`: Configurar en el servidor de producción
- `DATABASE_URL`: Base de datos PostgreSQL en producción

### CORS

Configurar en el backend para permitir:

- `https://lifehub-pro.expo.dev`
- `https://lifehub-pro.app`

## 📋 Checklist de Release

### Antes del Build

- [ ] Versión actualizada en `app.json`
- [ ] API URL configurada para producción
- [ ] Assets (icon, splash) verificados
- [ ] Tests pasando
- [ ] Linting sin errores críticos

### Después del Build

- [ ] Build exitoso sin errores
- [ ] App funciona en modo producción
- [ ] Conexión al backend verificada
- [ ] Notificaciones funcionando
- [ ] Todas las funcionalidades operativas

### Distribución

- [ ] APK/iOS build generado
- [ ] Subido a store/testing
- [ ] Usuarios invitados (si aplica)
- [ ] Monitoreo de crash reports configurado

## 🐛 Troubleshooting

### Build Fails

1. Verificar dependencias: `pnpm install`
2. Limpiar cache: `npx expo start --clear`
3. Verificar configuración en `app.json`

### App No Conecta al Backend

1. Verificar `API_URL` en configuración
2. Verificar CORS en backend
3. Verificar red y firewall

### Notificaciones No Funcionan

1. Verificar permisos en dispositivo
2. Verificar configuración de Expo
3. Verificar project ID en configuración

## 📞 Soporte

Para problemas de distribución:

1. Revisar logs de build
2. Verificar configuración de Expo
3. Contactar al equipo de desarrollo
