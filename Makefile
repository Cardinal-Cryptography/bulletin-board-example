PHONY: chain-stop chain-clean chain-restart chain-start

chain-stop:
	@ps aux | grep substrate-contracts-node | tr -s ' ' | cut -d ' ' -f 2 | xargs -r kill -9

chain-clean:
	@substrate-contracts-node purge-chain -y

chain-restart: chain-clean chain-start

chain-start:
	substrate-contracts-node --ws-port 9944 --dev

setup:
	@./scripts/deploy.sh
	@./scripts/update_contract_addresses.sh
	@./scripts/update_contract_metadata.sh
