#!/bin/bash

set -euo pipefail

source $(pwd)/scripts/env/local

$(pwd)/scripts/_deploy.sh
