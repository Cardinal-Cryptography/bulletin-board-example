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

    code_hash=$(cargo contract upload --quiet --url "$NODE_URL" --suri "$AUTHORITY_SEED" --skip-confirm)
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

pushd ${CONTRACTS_PATH}

echo "Instantiating Highlighted Posts contract"
HIGHLIGHTED_POSTS_WASM_FILE="highlighted_posts/target/ink/highlighted_posts.contract"
HIGHLIGHTED_POSTS_ADDRESS=$(cargo contract instantiate --url "$NODE_URL" --salt 48 --suri "$AUTHORITY_SEED" ${HIGHLIGHTED_POSTS_WASM_FILE} --constructor new --execute --skip-confirm | tail -n 1)
HIGHLIGHTED_POSTS_ADDRESS=${HIGHLIGHTED_POSTS_ADDRESS: -48}

echo "Instantiating Bulletin Board contract"
BULLETIN_BOARD_WASM_FILE="bulletin_board/target/ink/bulletin_board.contract"
BULLETIN_BOARD_ADDRESS=$(cargo contract instantiate --url "$NODE_URL" --salt 48 --suri "$AUTHORITY_SEED" ${BULLETIN_BOARD_WASM_FILE} --constructor new --args "0" "10" "Some(\"${HIGHLIGHTED_POSTS_ADDRESS}\")" --execute --skip-confirm | tail -n 1)
BULLETIN_BOARD_ADDRESS=${BULLETIN_BOARD_ADDRESS: -48}

if [[ -z BULLETIN_BOARD_ADDRESS && -v BULLETIN_BOARD_ADDRESS ]]; then
    echo "Empty BULLETIN_BOARD_ADDRESS"
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
