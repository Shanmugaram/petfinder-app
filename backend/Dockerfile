# ---------- Stage 1: Dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# ---------- Stage 2: Runtime ----------
FROM node:20-slim AS runtime
WORKDIR /app
RUN useradd -m runner
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV PORT=3000
RUN mkdir -p /var/log && touch /var/log/petfinder.log && chown -R runner:runner /var/log
USER runner
EXPOSE 3000
CMD ["node", "server.js"]

