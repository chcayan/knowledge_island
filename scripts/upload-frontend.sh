#!/bin/bash

SERVER_USER="ubuntu"
SERVER_IP="211.159.186.18"

LOCAL_FILES=(
  "./apps/frontend/.next/server"
  "./apps/frontend/.next/static"
  "./apps/frontend/.env.production"
)

REMOTE_DIRS=(
  "/home/ubuntu/knowledge_island/apps/frontend/.next/"
  "/home/ubuntu/knowledge_island/apps/frontend/.next/"
  "/home/ubuntu/knowledge_island/apps/frontend/"
)

ssh $SERVER_USER@$SERVER_IP "
cd /home/ubuntu/knowledge_island/apps/frontend &&
rm -rf .next &&
mkdir .next
"

find ./apps/frontend/.next -maxdepth 1 -type f -exec scp {} $SERVER_USER@$SERVER_IP:/home/ubuntu/knowledge_island/apps/frontend/.next/ \;

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

scp "./apps/frontend/.next/BUILD_ID" "$SERVER_USER@$SERVER_IP:/home/ubuntu/knowledge_island/apps/frontend/.next/"

echo "上传完成"
