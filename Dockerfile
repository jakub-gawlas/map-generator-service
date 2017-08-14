FROM zenika/alpine-chrome:latest

# Install dependencies
COPY package.json yarn.lock /usr/src/app/
RUN yarn --prod

# Copy sources
COPY src/ /usr/src/app/src/

# Set env variables
ENV CHROME_PATH=/usr/bin/chromium-browser

# Expose ports
EXPOSE 3000

CMD ["node", "src"]
