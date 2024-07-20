# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install npm globally
RUN npm install -g npm@10.8.1

# Install dependencies
# RUN npm install

# Copy the rest of the application code
COPY . .

# Ensure install.sh is executable
RUN chmod +x install.sh

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
