# LifeHub Monorepo

Aplicación de gestión de hábitos con backend NestJS + PostgreSQL y frontend React Native.

## 🏗️ Estructura del Proyecto

```
lifehub-pnpm/
├── apps/
│   ├── api/          # Backend NestJS + Prisma
│   └── mobile/       # App React Native + Expo
├── prisma/           # Schema y migraciones DB
└── packages/         # Código compartido
```

## 🚀 Levantar Proyecto

### 1. Instalar Dependencias

```bash
pnpm install
```

### 2. Backend + Base de Datos

```bash
# Levantar PostgreSQL
docker-compose up -d

# Ejecutar migraciones y seed
pnpm db:seed

# Iniciar servidor de desarrollo
pnpm --filter api dev
```

### 3. App Móvil

```bash
cd apps/mobile
npx expo start --clear
```

**Opciones:**

- `w` - Abrir en web
- `i` - iOS Simulator
- `a` - Android Emulator
- QR Code - Expo Go en móvil

### 4. Tests y Calidad

```bash
# Tests backend
pnpm --filter api test

# Lint global
pnpm lint

# Formato de código
pnpm format
```

## 📱 Funcionalidades Móvil

- ✅ Autenticación (Login/Register)
- ✅ Navegación con tabs
- ✅ Persistencia de sesión
- ✅ Cliente HTTP con interceptors
- 🔄 Gestión de hábitos (en desarrollo)

## 🔧 Scripts Útiles

```bash
# Base de datos
pnpm db:seed          # Poblar DB con datos demo
pnpm db:reset         # Resetear DB (próximo)

# Desarrollo
pnpm dev              # Backend + Móvil en paralelo
pnpm build            # Build de producción

# Calidad
pnpm lint             # ESLint global
pnpm format           # Prettier global
pnpm type-check       # TypeScript check
```

## 🗄️ API Endpoints

### Autenticación

- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión

### Hábitos

- `GET /habits` - Listar hábitos del usuario
- `POST /habits` - Crear hábito
- `PUT /habits/:id` - Actualizar hábito
- `DELETE /habits/:id` - Eliminar hábito

## 🛠️ Tecnologías

**Backend:**

- NestJS + TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

**Móvil:**

- React Native + Expo
- React Navigation
- TanStack Query
- Axios + Interceptors

**Herramientas:**

- pnpm Workspaces
- ESLint + Prettier
- Docker Compose
- GitHub Actions CI

## 📋 Próximas Funcionalidades

- [ ] CRUD completo de hábitos
- [ ] Tracking de progreso diario
- [ ] Notificaciones push
- [ ] Estadísticas y gráficos
- [ ] Temas y personalización
