#!/bin/bash

set -euo pipefail

HIGHLIGHTED_POSTS_CODE_HASH=""
HIGHLIGHTED_POSTS_ADDRESS=""
BULLETIN_BOARD_CODE_HASH=""
BULLETIN_BOARD_ADDRESS=""

function get_timestamp {
  echo "$(date +'%Y-%m-%d %H:%M:%S')"
}

function error {
  echo -e "[$(get_timestamp)] [ERROR] $*"
  exit 1
}

function log_progress {
  bold=$(tput bold)
  normal=$(tput sgr0)
  echo "[$(get_timestamp)] [INFO] ${bold}${1}${normal}"
}


CONTRACTS_PATH=$(pwd)/contracts

function build_contract {
  cargo +nightly contract build --quiet --release 1> /dev/null 2> /dev/null
}

function build_highlighted_posts_contract {
    cd "$CONTRACTS_PATH"/highlighted_posts
    cargo +nightly contract build --quiet --release 1> /dev/null 2> /dev/null
}

function build_bulletin_board_contract {
    cd "$CONTRACTS_PATH"/bulletin_board
    cargo +nightly contract build --quiet --release 1> /dev/null 2> /dev/null
}

function deploy_highlighted_posts_contract {
    cd "$CONTRACTS_PATH"/highlighted_posts
    cargo contract upload --quiet --url "$NODE_URL" --suri "$AUTHORITY_SEED" target/ink/highlighted_posts.wasm --skip-confirm  1> /dev/null 2> /dev/null
    HIGHLIGHTED_POSTS_CODE_HASH=$(cat target/ink/metadata.json | jq -rc .source.hash)
    echo "Highlighted posts code hash: ${HIGHLIGHTED_POSTS_CODE_HASH}"
}

function deploy_bulletin_board_contract {
    cd "$CONTRACTS_PATH"/bulletin_board
    cargo contract upload --quiet --url "$NODE_URL" --suri "$AUTHORITY_SEED" target/ink/bulletin_board.wasm --skip-confirm  1> /dev/null 2> /dev/null
    BULLETIN_BOARD_CODE_HASH=$(cat target/ink/metadata.json | jq -rc .source.hash)
    echo "Bulleting board code hash: ${BULLETIN_BOARD_CODE_HASH}"
}

function instantiate_bulletin_board_contract {
    result=$(cargo contract instantiate --url "$NODE_URL" --suri "$AUTHORITY_SEED" --code-hash "$BULLETIN_BOARD_CODE_HASH" --constructor new --args "0" "10" "$HIGHLIGHTED_POSTS_CODE_HASH" --skip-confirm)
    # We're initializing `highlighted_posts` contract in the constructor of `bulletin board` so there will be multiple new contract addresses.
    # `cargo contract` prints the first one, rather than the last one, so we have to extract it from the events.
    BULLETIN_BOARD_ADDRESS=$(echo "$result" | grep -A3 "Event Contracts ➜ Instantiated" | grep contract | tail -1 | cut -d ' ' -f11)
    echo "Bulletin board address: ${BULLETIN_BOARD_ADDRESS}"
    HIGHLIGHTED_POSTS_ADDRESS=$(cargo contract call --url "$NODE_URL" --contract "$BULLETIN_BOARD_ADDRESS" --skip-confirm --suri "$AUTHORITY_SEED" -m get_highlights_board --quiet --dry-run | grep Data | grep -Poe "Some\(\K[a-zA-Z0-9]+")
    echo "Highlighted posts address: ${HIGHLIGHTED_POSTS_ADDRESS}"
}

log_progress "Building Highlighted Posts contract"
build_highlighted_posts_contract || error "Failed to build the contract"

log_progress "Building Bulletin Board contract"
build_bulletin_board_contract || error "Failed to build the contract"

log_progress "Deploying Higlighted Posts contract"
deploy_highlighted_posts_contract || error "Failed to deploy contract"

log_progress "Deploying Bulletin Board contract"
deploy_bulletin_board_contract || error "Failed to deploy contract"

log_progress "Instantating Bulletin Board contract"
instantiate_bulletin_board_contract || error "Failed to instantiate contract"

jq -n \
    --arg highlighted_posts_code_hash "${HIGHLIGHTED_POSTS_CODE_HASH}" \
    --arg highlighted_posts_address "${HIGHLIGHTED_POSTS_ADDRESS}" \
    --arg bulletin_board_code_hash "${BULLETIN_BOARD_CODE_HASH}" \
    --arg bulletin_board_address "${BULLETIN_BOARD_ADDRESS}" \
    '{ 
        "highlighted_posts_code_hash" : $highlighted_posts_code_hash,
        "highlighted_posts_address" : $highlighted_posts_address,
        "bulletin_board_code_hash" : $bulletin_board_code_hash,
        "bulletin_board_address" : $bulletin_board_address
    }' > addresses.json

log_progress "Finished initialization. See addresses in addresses.json"