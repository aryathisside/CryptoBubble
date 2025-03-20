#!/bin/bash

LOCAL_ENV_FILE=".env.deploy"

# Load environment variables
if [[ -f $LOCAL_ENV_FILE ]]; then
    set -o allexport
    source $LOCAL_ENV_FILE
    set +o allexport
else
    echo "❌ ERROR: .env file not found!"
    exit 1
fi

# Validate required variables
REQUIRED_VARS=("GITHUB_TOKEN" "REMOTE_PASSWORD" "REMOTE_USER" "REMOTE_IP" "GITHUB_USERNAME" "SERVICE_NAME" "EXTERNAL_PORT")
for var in "${REQUIRED_VARS[@]}"; do
    if [[ -z "${!var}" ]]; then
        echo "❌ ERROR: Required environment variable '$var' is missing!"
        exit 1
    fi
done

#!/bin/bash

# Step 1: Prepare build arguments from .env.build file
# Step 1: Prepare build arguments from .env file
#echo $BUILD_ARGS
# Step 2: Build the Docker image with environment variables as build args
echo "🚀 Building the Docker image with environment variables..."
docker build -t $DOCKER_IMAGE_NAME:${VERSION_NO} .
if [[ $? -ne 0 ]]; then
    echo "❌ ERROR: Docker image build failed!"
    exit 1
fi

echo "🔖 Tagging the image for GitHub Container Registry (GHCR)..."
docker tag ${DOCKER_IMAGE_NAME}:${VERSION_NO} ${GITHUB_REGISTRY}/${GITHUB_REPO_NAME}:${VERSION_NO}

echo "🔖 Tagging the image for Docker Hub (Optional)..."
docker tag ${DOCKER_IMAGE_NAME}:${VERSION_NO} ${DOCKER_HUB_USERNAME}/${DOCKER_HUB_REPO}:${VERSION_NO}

# Step 3: Authenticate with GHCR
echo "🔑 Authenticating with GitHub Container Registry..."
echo "${GITHUB_TOKEN}" | docker login ${GITHUB_REGISTRY} -u ${GITHUB_USERNAME} --password-stdin
if [[ $? -ne 0 ]]; then
    echo "❌ ERROR: Authentication with GitHub Container Registry failed!"
    exit 1
fi

# Step 4: Push to GHCR
echo "📤 Pushing the Docker image to GHCR..."
docker push ${GITHUB_REGISTRY}/${GITHUB_REPO_NAME}:${VERSION_NO}
if [[ $? -ne 0 ]]; then
    echo "❌ ERROR: Docker push to GHCR failed!"
    exit 1
fi

# Optional: Push to Docker Hub (if needed)
if [[ -n "$DOCKER_HUB_USERNAME" ]]; then
    echo "🔑 Authenticating with Docker Hub..."
    docker login -u "$DOCKER_HUB_USERNAME" --password-stdin <<< "$DOCKER_HUB_PASSWORD"
    echo "📤 Pushing the Docker image to Docker Hub..."
    docker push ${DOCKER_HUB_USERNAME}/${DOCKER_HUB_REPO}:${VERSION_NO}
    if [[ $? -ne 0 ]]; then
        echo "❌ ERROR: Docker push to Docker Hub failed!"
        exit 1
    fi
fi

# Step 5: Transfer the .env file to the remote server
echo "📡 Transferring .env file to the server..."
sshpass -p "${REMOTE_PASSWORD}" scp -o StrictHostKeyChecking=no .env ${REMOTE_USER}@${REMOTE_IP}:${ENV_FILE_PATH}
if [[ $? -ne 0 ]]; then
    echo "❌ ERROR: Failed to transfer .env file!"
    exit 1
fi

# Step 6: Deploy on the server using Docker Compose
echo "🚀 Deploying on the Azure server..."
sshpass -p "${REMOTE_PASSWORD}" ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP} << EOF
set -e

if ! command -v docker &> /dev/null; then
    echo "❌ ERROR: Docker is not installed!"
    exit 1
fi
if ! command -v docker-compose &> /dev/null; then
    echo "❌ ERROR: Docker Compose is not installed!"
    exit 1
fi

echo "🔑 Authenticating with GHCR on remote server..."
echo "${GITHUB_TOKEN}" | docker login ${GITHUB_REGISTRY} -u ${GITHUB_USERNAME} --password-stdin

echo "📥 Pulling the latest Docker image..."
docker pull ${GITHUB_REGISTRY}/${GITHUB_REPO_NAME}:${VERSION_NO}

echo "🛑 Checking if the container exists..."
if docker ps -a --format '{{.Names}}' | grep -wq "${DOCKER_IMAGE_NAME}"; then
    echo "🛑 Stopping and removing existing container..."
    docker stop ${DOCKER_IMAGE_NAME} || true
    docker rm ${DOCKER_IMAGE_NAME} || true
else
    echo "ℹ️ No existing container found. Skipping stop and removal."
fi

docker run -d -p ${EXTERNAL_PORT}:${INTERNAL_PORT} --env-file ${ENV_FILE_PATH} ${GITHUB_REGISTRY}/${GITHUB_REPO_NAME}:${VERSION_NO}


# echo "⚙️ Deploying using Docker Compose..."
# cd /home/Azureadmin
# echo '
# version: "3.8"
# services:
#   ${SERVICE_NAME}:
#     image: ${GITHUB_REGISTRY}/${GITHUB_REPO_NAME}:${VERSION_NO}
#     ports:
#       - ${EXTERNAL_PORT}:${INTERNAL_PORT}
#     restart: always
#     env_file:
#       - ${ENV_FILE_PATH}
#     command: npm start
# ' > docker-compose.yml

# docker-compose up -d

echo "✅ Deployment completed successfully!"


if [[ $? -ne 0 ]]; then
    echo "❌ ERROR: Deployment on the Azure server failed!"
    exit 1
fi

echo "🎉 Application is now running on port " ${EXTERNAL_PORT}
EOF

