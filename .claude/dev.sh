#!/bin/bash
export NVM_DIR="$HOME/.nvm"
export PATH="$NVM_DIR/versions/node/v24.19.0/bin:$PATH"
cd /Users/test/2026-Portfolio
exec node node_modules/.bin/next dev --webpack
