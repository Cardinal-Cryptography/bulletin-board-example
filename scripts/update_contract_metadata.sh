#!/usr/bin/env bash

# This script copies `metadata.json` files from contracts' target directories into frontend metadata.
# This is required so that the frontend can interact with deployed contracts.
set -euo pipefail

CONTRACTS_PATH=$(pwd)/contracts

METADATA_FILE=/target/ink/metadata.json
BULLETIN_BOARD_METADATA=$(pwd)/frontend/src/metadata/metadata_bulletin_board.json
HIGHLIHTED_POSTS_METADATA=$(pwd)/frontend/src/metadata/metadata_highlighted_posts.json

cp ${CONTRACTS_PATH}/bulletin_board/target/ink/bulletin_board.json ${BULLETIN_BOARD_METADATA}
cp ${CONTRACTS_PATH}/highlighted_posts/target/ink/highlighted_posts.json ${HIGHLIHTED_POSTS_METADATA}

echo "Contract metadata updated"
exit 0
