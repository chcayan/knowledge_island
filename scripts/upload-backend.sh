#!/bin/bash

SERVER_USER="ubuntu"
SERVER_IP="211.159.186.18"

LOCAL_FILES=(
  # "./apps/backend/dist"
  "./apps/backend/.env.production"
)

REMOTE_DIRS=(
  # "/home/ubuntu/knowledge_island/apps/backend/"
  "/home/ubuntu/knowledge_island/apps/backend/"
)

for i in "${!LOCAL_FILES[@]}"; do
  LOCAL="${LOCAL_FILES[$i]}"
  REMOTE="${REMOTE_DIRS[$i]}"

  echo "上传 $LOCAL 到 $SERVER_IP:$REMOTE"
  
 if [ -d "$LOCAL" ]; then
    scp -r "$LOCAL" "$SERVER_USER@$SERVER_IP:$REMOTE"
  else
    scp "$LOCAL" "$SERVER_USER@$SERVER_IP:$REMOTE"
  fi
done

echo "上传完成"
