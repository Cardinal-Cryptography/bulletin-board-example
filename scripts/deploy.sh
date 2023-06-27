#!/usr/bin/env bash

# This script does the following:
# * deploys Highlighted Posts and Bulletin Board contracts
# * instantiates them
# * stores addreses in the `addresses.json` file in the current directory
#
# What it does not do:
# * it doesn't build the contracts - assumes they're already built

set -euo pipefail

# Quiet versions of pushd and popd
pushd () {
    command pushd "$@" > /dev/null
}

popd () {
    command popd "$@" > /dev/null
}

CONTRACTS_PATH=$(pwd)/contracts

NODE_URL=${NODE_URL:="ws://localhost:9944"}
AUTHORITY_SEED=${AUTHORITY_SEED:="//Alice"}

echo "node=${NODE_URL}"
echo "authority_seed=${AUTHORITY_SEED}"

function upload_contract {

    local  __resultvar=$1
    local contract_name=$2

    pushd "$CONTRACTS_PATH"/$contract_name

    echo "Uploading ${contract_name}"

    # --- UPLOAD CONTRACT CODE

    code_hash=$(cargo contract upload --quiet --url "$NODE_URL" --suri "$AUTHORITY_SEED" --execute --skip-confirm)
    code_hash=$(echo "${code_hash}" | grep hash | tail -1 | cut -c 14-)

    eval $__resultvar=${code_hash}

    popd
}

function extract_contract_addresses {
    jq  '.events[] | select((.pallet == "Contracts") and (.name = "Instantiated")) | .fields[] | select(.name == "contract") | .value.Literal'
}

function extract_from_quotes {
    echo $1 | tr -d '"'
}

upload_contract BULLETIN_BOARD_CODE_HASH bulletin_board
echo "Bulletin Board code hash: ${BULLETIN_BOARD_CODE_HASH}"

upload_contract HIGHLIGHTED_POSTS_CODE_HASH highlighted_posts
echo "Highlighted Posts code hash: ${HIGHLIGHTED_POSTS_CODE_HASH}"


# --- instantiate contracts

pushd ${CONTRACTS_PATH}/bulletin_board

# Using temporary file as piping JSON from env variable crates problems with escaping.
temp_file=$(mktemp)
# Remove temporary file when finished.
trap "rm -f $temp_file" 0 2 3 15 

SALT=${BULLETIN_BOARD_VERSION:-0}
BULLETIN_BOARD_CONTRACT_FILE="target/ink/bulletin_board.contract"

echo "Instantiating Bulletin Board contract (version: ${SALT})"
cargo contract instantiate --url "$NODE_URL" --salt ${SALT} --suri "$AUTHORITY_SEED" $BULLETIN_BOARD_CONTRACT_FILE --constructor new --args "${SALT}" "10" $HIGHLIGHTED_POSTS_CODE_HASH --execute --skip-confirm --output-json > temp_file

# We're initializing `highlighted_posts` contract in the constructor of `bulletin board`
# so there will be multiple new contract addresses. `cargo contract` outputs the first one
# from the list but that will be the last contract instantiated and the Bulletin Board contract address is the last one on that list.
BULLETIN_BOARD_ADDRESS=$(cat temp_file | jq  '.events[] | select((.pallet == "Contracts") and (.name = "Instantiated")) | .fields[] | select(.name == "contract") | .value.Literal' | tail -1 | tr -d '"')
if [[ -z BULLETIN_BOARD_ADDRESS && -v BULLETIN_BOARD_ADDRESS ]]; then
    echo "Empty BULLETIN_BOARD_ADDRESS"
    exit 1
fi

HIGHLIGHTED_POSTS_ADDRESS=$(cat temp_file | jq  '.events[] | select((.pallet == "Contracts") and (.name = "Instantiated")) | .fields[] | select(.name == "contract") | .value.Literal' | head -1 | tr -d '"')
if [[ -z HIGHLIGHTED_POSTS_ADDRESS && -v HIGHLIGHTED_POSTS_ADDRESS ]]; then
    echo "Empty HIGHLIGHTED_POSTS_ADDDRESS"
    exit 1
fi

echo "Bulletin Board instance address: ${BULLETIN_BOARD_ADDRESS}"
echo "Highlighted Posts instance address: ${HIGHLIGHTED_POSTS_ADDRESS}"

popd

jq -n --arg bulletin_board_code_hash "$BULLETIN_BOARD_CODE_HASH" \
    --arg highlighted_posts_code_hash "$HIGHLIGHTED_POSTS_CODE_HASH" \
    --arg bulletin_board_address "$BULLETIN_BOARD_ADDRESS" \
    --arg highlighted_posts_address "$HIGHLIGHTED_POSTS_ADDRESS" \
    '{
        bulletin_board_code_hash: $bulletin_board_code_hash,
        highlighted_posts_code_hash: $highlighted_posts_code_hash,
        bulletin_board_address: $bulletin_board_address,
        highlighted_posts_address: $highlighted_posts_address
    }' > ${PWD}/scripts/addresses.json

echo "Contract addresses stored in addresses.json"
exit 0

