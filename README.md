# LifeHub Monorepo

## 🚀 Levantar Proyecto

### 1. Backend + Base de Datos

```bash
docker-compose up -d
pnpm db:seed
```

### 2. Lanzar App Móvil

```bash
cd apps/mobile
npx expo start --clear
```

### 3. Correr Tests Backend

```bash
pnpm --filter api test
```

### 4. Lint y Formato

```bash
pnpm eslint . --fix
pnpm prettier --write .
```

### 5. Documentación API

- Endpoints: ver carpeta `apps/api/src` o futura colección Postman.
