FROM node:22

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm && corepack prepare pnpm@10 --activate
RUN pnpm i --frozen-lockfile --unsafe-perm

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]