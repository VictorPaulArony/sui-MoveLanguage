import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui.js/client';

//Contract metadata
export const CONTRACT_ADDRESS = '0x7bff7cec7656378f7b4cf38c9f05523d3b6f1c27ce530b887d62053f94ccc';
export const SWAP_STATE_ID = '0xe956f406b371ff76e229b1ce435d28feedaa23cb4e55ef15911c88243887b590';

//Assume module/function names in your Move contract
const MODULE_NAME = 'swap';
const FUNCTION_NAME = 'swap_tokens';

//Build the transaction to swap tokens
export const BuildSwapTransaction = (amount) => {
  try {
    const tx = new TransactionBlock();

    // Move call to the contract function
    tx.moveCall({
      target: `${CONTRACT_ADDRESS}::${MODULE_NAME}::${FUNCTION_NAME}`,
      arguments: [
        tx.pure(amount) // You can convert to bigint if needed
      ],
    });

    return tx;
  } catch (err) {
    console.error("Error building swap transaction:", err);
    throw new Error("Failed to build swap transaction");
  }
};

// Connect to Sui fullnode (testnet in this case)
const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' });

//Fetch on-chain state of the contract
export const GetContractState = async () => {
  try {
    const response = await client.getObject({
      id: SWAP_STATE_ID,
      options: {
        showContent: true,
      },
    });

    const content = response.data?.content;

    if (!content || content.dataType !== 'moveObject') {
      throw new Error("Invalid contract state format");
    }

    const fields = content.fields;

    return {
      lpBalance: fields.lp_balance?.toString() || '0',
      lpAddress: fields.lp_address || '',
      totalSwaps: parseInt(fields.total_swaps || '0', 10),
    };
  } catch (err) {
    console.error("Error fetching contract state:", err);
    throw new Error("Failed to fetch contract state");
  }
};
