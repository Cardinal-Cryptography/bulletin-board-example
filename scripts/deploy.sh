#!/bin/bash

set -euo pipefail

CONTRACTS_PATH=$(pwd)/contracts

cd "$CONTRACTS_PATH"/bulletin_board && cargo contract build --release --quiet

cd "$CONTRACTS_PATH"/highlighted_posts && cargo contract build --release --quiet


HIGHLIGHTED_POSTS_CODE_HASH=$(cargo contract upload --quiet --url "$NODE_URL" --suri "$AUTHORITY_SEED" target/ink/highlighted_posts.wasm --skip-confirm)
HIGHLIGHTED_POSTS_CODE_HASH=$(echo "$HIGHLIGHTED_POSTS_CODE_HASH" | grep hash | tail -1 | cut -c 14-)

echo "Highlighted posts code hash: $HIGHLIGHTED_POSTS_CODE_HASH"

cd "$CONTRACTS_PATH"/bulletin_board
BULLETIN_BOARD_CODE_HASH=$(cargo contract upload --quiet --url "$NODE_URL" --suri "$AUTHORITY_SEED" target/ink/bulletin_board.wasm --skip-confirm)
BULLETIN_BOARD_CODE_HASH=$(echo "$BULLETIN_BOARD_CODE_HASH" | grep hash | tail -1 | cut -c 14-)
echo "Bulletin board code hash: $BULLETIN_BOARD_CODE_HASH"
BULLETIN_BOARD=$(cargo contract instantiate --url "$NODE_URL" --suri "$AUTHORITY_SEED" --code-hash "$BULLETIN_BOARD_CODE_HASH" --constructor new --args "0" "10" "$HIGHLIGHTED_POSTS_CODE_HASH" --skip-confirm)
# We're initializing `highlighted_posts` contract in the constructor of `bulletin board` so there will be multiple new contract addresses.
# `cargo contract` prints the first one, rather than the last one, so we have to extract it from the events.
BULLETIN_BOARD=$(echo "$BULLETIN_BOARD" | grep -A3 "Event Contracts ➜ Instantiated" | grep contract | tail -1 | cut -d ' ' -f11)
echo "Bulletin board instance address: $BULLETIN_BOARD"

