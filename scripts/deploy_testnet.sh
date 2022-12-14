#!/bin/bash

set -euo pipefail

source $(pwd)/scripts/env/testnet

$(pwd)/scripts/_deploy.sh
