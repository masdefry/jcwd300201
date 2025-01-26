# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .
COPY prisma ./prisma/

# Expose the port your app runs on
EXPOSE 3000

# Define the default command to start the app
CMD ["npm", "run", "serve"]
