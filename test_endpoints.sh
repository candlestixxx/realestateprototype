# 1. Register a test user
echo "Registering..."
REG_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{"email":"oauth_test2@example.com","password":"pass","name":"Test OAuth User"}')
TOKEN=$(echo $REG_RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

if [ -z "$TOKEN" ]; then
  echo "Registration failed. Trying login..."
  LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"oauth_test2@example.com","password":"pass"}')
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
fi

echo "Token: $TOKEN"

# 2. Get initial Status (Should be false for all)
echo "Initial Status:"
curl -s -X GET http://localhost:3001/api/oauth/status -H "Authorization: Bearer $TOKEN"

# 3. Connect Facebook
echo -e "\n\nConnecting Facebook..."
curl -s -X POST http://localhost:3001/api/oauth/connect -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"platform": "facebook"}'

# 4. Get Status Again (Facebook should be true)
echo -e "\n\nStatus after connect:"
curl -s -X GET http://localhost:3001/api/oauth/status -H "Authorization: Bearer $TOKEN"

# 5. Disconnect Facebook
echo -e "\n\nDisconnecting Facebook..."
curl -s -X POST http://localhost:3001/api/oauth/disconnect -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"platform": "facebook"}'

# 6. Final Status
echo -e "\n\nFinal Status:"
curl -s -X GET http://localhost:3001/api/oauth/status -H "Authorization: Bearer $TOKEN"
