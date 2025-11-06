FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create upload directories
RUN mkdir -p uploads/temp public/uploads/images public/uploads/videos public/uploads/thumbnails

EXPOSE 5000

CMD ["npm", "start"]

