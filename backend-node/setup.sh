#!/bin/bash
echo "Setting up SafeRoute Backend..."
echo

# Change to backend-node directory
cd "$(dirname "$0")"

echo "[1/3] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing dependencies!"
    exit 1
fi

echo
echo "[2/3] Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "Error generating Prisma client!"
    exit 1
fi

echo
echo "[3/3] Running database migrations..."
npx prisma migrate dev --name init
if [ $? -ne 0 ]; then
    echo "Error running migrations!"
    exit 1
fi

echo
echo "Setup complete!"
echo
echo "To start the server:"
echo "  npm run dev"
echo
echo "Or:"
echo "  npm start"
echo

