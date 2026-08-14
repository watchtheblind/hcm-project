# ---------- build ----------
FROM node:22-bookworm-slim AS build

WORKDIR /app

# libs nativos para bcrypt/prisma (glibc suficiente, sin alpine)
COPY package.json package-lock.json* ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
RUN npm run build

# ---------- runtime ----------
FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist

# Prisma necesita schema + generated client en runtime
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/main.js"]