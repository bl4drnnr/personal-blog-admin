#!/bin/bash

cat > ./src/env-config.js << EOF
window.BASIC_AUTH_USERNAME = '${BASIC_AUTH_USERNAME}';
window.BASIC_AUTH_PASSWORD = '${BASIC_AUTH_PASSWORD}';
EOF

echo "env-config.js generated successfully"
