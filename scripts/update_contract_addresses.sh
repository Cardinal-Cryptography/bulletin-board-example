#!/usr/bin/env bash

# This script copies `addresses.json` files from ./scriptes directory into frontend metadata.
# This is required so that the frontend can interact with deployed contracts.
set -euo pipefail

cp $(pwd)/scripts/addresses.json $(pwd)/frontend/src/metadata/
exit 0
