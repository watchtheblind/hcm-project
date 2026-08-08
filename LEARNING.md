# Guía de aprendizaje — Hexagonal + NestJS + Prisma

> Para mí, para cuando me pierdo. Cero teoría rebuscada: una sola historia que entender.

---

## 1. La historia (la única que necesitas)

```
POST /auth/register
   │
   ▼
Controller   ← el mesero: recibe el pedido (HTTP)
   │
   ▼
Use Case     ← el chef: decide qué se cocina (lógica de negocio)
   │
   ▼
Port         ← la lista de ingredientes que el chef pide (contrato)
   │
   ▼
Adapter      ← la despensa: Prisma entrega los ingredientes (base de datos)
```

**Hexagonal en una frase:** el chef no va él mismo a la despensa.
Si cambias la despensa (Prisma → TypeORM → Mongo), el chef no cambia. Solo cambia el adapter.

### Nuestro proyecto real (mismo patrón, archivos reales)

| Rol (teoría) | Archivo real |
|---|---|
| Mesero (HTTP) | `backend/src/auth/infrastructure/auth.controller.ts` |
| Chef (lógica) | `backend/src/auth/application/use-cases/register.use-case.ts` |
| Lista de ingredientes (contrato) | `backend/src/auth/domain/ports/auth-repository.port.ts` |
| Despensa (DB) | `backend/src/auth/infrastructure/adapters/prisma-auth.repository.ts` |
| Reglas del negocio | `backend/src/auth/domain/user.domain.ts` |

---

## 2. Las capas (regla de oro)

| Capa | Sabe de | NO sabe de |
|------|---------|-----------|
| **Domain** | Reglas del negocio, tipos | NestJS, Prisma, Express, Passport |
| **Application** | Ports, DTOs, casos de uso | Prisma, HTTP, Passport |
| **Infrastructure** | Todo (NestJS, Prisma, Passport) | — |

**Pregunta clave para entender cualquier pieza:**
*"¿Y si esto no existiera, qué pasaría?"*

- ¿Y si el port no existiera? → el use case hablaría directo con Prisma = enredo, imposible de testear.
- ¿Y si el adapter no existiera? → el port no tendría quién lo implemente = la app no arranca.
- ¿Y si Prisma fuera TypeORM? → solo cambia el adapter. **Nada más.** *Esa* es la ganancia hexagonal.

**Por qué el port es una clase abstracta y no una interface:** NestJS inyecta dependencias por tipo en runtime. Las interfaces de TypeScript se borran al compilar; las clases no. El port como clase abstracta sobrevive y NestJS puede resolverlo.

---

## 3. Cómo leer este código (NO en orden de carpetas)

El orden de carpetas es el orden de *diseño* (`domain → application → infrastructure`), pero confunde al leer.
El orden de *lectura* es el inverso: empieza por lo que ve el usuario y ve hacia adentro.

**Ruta `/auth/register` — orden de lectura:**

1. `backend/src/auth/infrastructure/auth.controller.ts` — qué recibe y qué responde
2. `backend/src/auth/application/use-cases/register.use-case.ts` — qué lógica corre
3. `backend/src/auth/domain/ports/auth-repository.port.ts` — qué necesita el chef
4. `backend/src/auth/infrastructure/adapters/prisma-auth.repository.ts` — de dónde sale la data

**Ruta `/auth/login` — misma historia (te va a parecer repetido = ya lo entiendes):**

1. `auth.controller.ts` → `login` (líneas 33-39)
2. `login.use-case.ts` → verifica email + password, firma token
3. `auth-repository.port.ts` → `findCredentialsByEmail` (existe porque el dominio no guarda passwords)
4. `prisma-auth.repository.ts` → `findCredentialsByEmail`

**El guard y el decorator (cómo proteger rutas):**

- `guards/jwt-auth.guard.ts` — el portero: "¿tienes token válido? entras. ¿no? 401"
- `decorators/current-user.decorator.ts` — el llavero: te entrega el usuario autenticado ya verificado
- `strategies/jwt.strategy.ts` — el inspector: verifica la firma del token con el secreto

---

## 4. Plan de estudio (3 sesiones, 1 tema cada una)

No intentes aprender todo junto: tres frentes a la vez = perderse. Una sesión por tema.

### Sesión 1 — NestJS (el framework)

**Objetivo:** entender qué es un controller, un module, un guard, un decorator.

- [NestJS docs — Fundamentals](https://docs.nestjs.com/first-steps)
- Lee: `auth.controller.ts`, `auth.module.ts`, `jwt-auth.guard.ts`, `current-user.decorator.ts`
- **Test mental:** ¿qué pasa si borro el `@Controller('auth')` del controller?

### Sesión 2 — Hexagonal (el patrón)

**Objetivo:** entender port / adapter / capas.

- [Hexagonal Architecture — Alistair Cockburn (el autor original)](https://alistair.cockburn.us/hexagonal-architecture/)
- [NestJS Hexagonal Example — tim-hub](https://github.com/tim-hub/nestjs-hexagonal-example) (125★, con explicación y código)
- [Domain-Driven Hexagon — Sairyss](https://github.com/Sairyss/domain-driven-hexagon) (la guía más completa de hex + DDD en TS/NestJS)
- **Test mental:** cambia Prisma por un repositorio en memoria (lista de JS). ¿Qué archivos tocarías? → solo el adapter y el module.

### Sesión 3 — Prisma (la base de datos)

**Objetivo:** entender modelo, migración, y qué devuelve un query.

- [Prisma docs — Concepts](https://www.prisma.io/docs/orm/prisma-schema/overview)
- Lee: `backend/prisma/schema.prisma` (el modelo `User`)
- **Test mental:** ¿por qué `id` es `BigInt`? (porque Postgres lo genera así — y por eso en el código del dominio `UserDomain.id` es `bigint`, no `number`)

### Después de las 3 sesiones

Repite el flujo completo con `/auth/login` leyendo archivo por archivo.
Cuando `/auth/login` te parezca repetido de `/auth/register` → ya lo entendiste.

---

## 5. Comandos que vas a usar (guardados en `package.json`)

```bash
bun run start:dev      # arrancar la app en modo watch
bun run build          # compilar
bun run db:migrate --name nombre  # crear y aplicar migración
bun run db:generate    # regenerar el cliente Prisma
bun run db:studio      # ver la base de datos en el navegador
bun run lint           # formatear y limpiar código
```

---

## 6. Vocabulario mínimo (glosario rápido)

| Término | Qué significa | En el código |
|---------|--------------|-------------|
| **Controller** | Recibe requests HTTP | `auth.controller.ts` |
| **Module** | Caja que agrupa piezas y las conecta | `auth.module.ts` |
| **Use Case** | Un caso de uso = una acción del negocio | `register.use-case.ts` |
| **Port** | Contrato que el dominio declara | `auth-repository.port.ts` |
| **Adapter** | Implementación real del contrato | `prisma-auth.repository.ts` |
| **Guard** | Portero: protege rutas | `jwt-auth.guard.ts` |
| **Decorator** | Etiqueta que agrega comportamiento | `@CurrentUser()`, `@Injectable()` |
| **DI (inyección de dependencias)** | NestJS le "presta" las herramientas a las clases | el `constructor()` |
| **DTO** | Forma de los datos que entran/salen por HTTP | `RegisterDto`, `LoginDto` |
| **JWT** | Token firmado = llave de acceso | `jwt.strategy.ts` |

---

## 7. Cierre diario (5 minutos)

¿Qué archivo vi hoy y para qué servía? En una frase. Escríbelo abajo.

- Día 1: _______________________________________
- Día 2: _______________________________________
- Día 3: _______________________________________
