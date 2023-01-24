import type { Weight, ContractExecResult } from '@polkadot/types/interfaces';
import { BN } from '@polkadot/util';
import { ContractPromise } from '@polkadot/api-contract';
import { AbiMessage, ContractOptions } from '@polkadot/api-contract/types';
import { ApiPromise } from '@polkadot/api';

type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

const toContractAbiMessage = (
  contractPromise: ContractPromise,
  message: string
): Result<AbiMessage, string> => {
  const value = contractPromise.abi.messages.find((m) => m.method === message);

  if (!value) {
    const messages = contractPromise?.abi.messages.map((m) => m.method).join(', ');

    const error = `"${message}" not found in metadata.spec.messages: [${messages}]`;
    console.error(error);

    return { ok: false, error };
  }

  return { ok: true, value };
};

export const getGasLimit = async (
  api: ApiPromise,
  userAddress: string,
  message: string,
  contract: ContractPromise,
  options = {} as ContractOptions,
  args = [] as unknown[]
  // temporarily type is Weight instead of WeightV2 until polkadot-js type `ContractExecResult` will be changed to WeightV2
): Promise<Result<Weight, string>> => {
  const abiMessage = toContractAbiMessage(contract, message);
  if (!abiMessage.ok) return abiMessage;

  const { value, gasLimit, storageDepositLimit } = options;

  const result = await api.call.contractsApi.call<ContractExecResult>(
    userAddress,
    contract.address,
    value ?? new BN(0),
    gasLimit ?? null,
    storageDepositLimit ?? null,
    abiMessage.value.toU8a(args)
  );

  return { ok: true, value: result.gasRequired };
};
