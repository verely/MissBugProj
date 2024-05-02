# Build frontend (into backend/public dir)
echo "Building frontend..."
cd ../miss-bug-front
npm i
npm run build
# Build backend
echo "Building backend..."
cd ../miss-bug-server
npm i
