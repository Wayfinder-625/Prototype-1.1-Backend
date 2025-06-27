FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install ALL dependencies needed for the build

RUN npm ci

# Copy the rest of the application source code
COPY . .



# Generate the Prisma client

RUN npx prisma generate



# Build the NestJS application into the /dist folder

RUN npm run build





FROM node:18-alpine



WORKDIR /app



# Create a non-root user for better security

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser



COPY package*.json ./



# Install ONLY production dependencies

RUN npm ci --only=production



# Copy the built application and the prisma client from the "builder" stage

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma



EXPOSE 3000



# The command to start the application directly

CMD ["node", "dist/main.js"]