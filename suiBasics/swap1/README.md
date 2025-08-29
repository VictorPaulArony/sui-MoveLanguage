## README.md

# Swap1 Module – Sui Smart Contract for SUI Coin Swapping

This Move module provides a basic framework for a **swap system** on the Sui blockchain, allowing users to:

* Swap SUI tokens with a registered Liquidity Provider (LP)
* Get an on-chain receipt NFT for the swap
* Record transactions for off-chain systems via events
* Allow the contract owner to manage and withdraw funds

---

## Prerequisites

* [Sui CLI](https://docs.sui.io/build/install) installed
* Sui testnet/devnet account with SUI tokens
* `sui` client configured (`sui client active-address` should show your address)

---

## Project Structure

```
swap1/
├── sources/
│   └── swap1.move        
├── Move.toml             
└── README.md        
```

---

## Getting Started

### 1. Clone & Build

```bash
sui move build
```

---

### 2. Publish the Module

```bash
sui client publish --gas-budget 100000000
```

**Note:** Take note of the package ID after publishing (e.g., `0xabc123...`). We'll use this in all further commands.

---

### 3. Initialize the Contract State

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module swap1 \
  --function init \
  --args \
  --gas-budget 100000000
```

 This creates a `SwapState` object, shared on-chain.

---

## Functions and Usage (via `sui client`)

### 1. Swap SUI for a receipt (main user function)

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module swap1 \
  --function swap \
  --args <SWAP_STATE_ID> <SUI_COIN_OBJECT_ID> <CLOCK_OBJECT_ID> \
  --gas-budget 100000000
```

📘 Output:

* Transfers a `SwapReceipt` NFT and `Payment` object to your address
* Emits a `SwapEvent`
* Increases LP balance

---

### 2. Set/Update LP Address (owner only)

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module swap1 \
  --function set_lp_address \
  --args <SWAP_STATE_ID> <NEW_LP_ADDRESS> \
  --gas-budget 100000000
```

---

### 3. Withdraw Funds (Owner Only)

#### a) Withdraw a specific amount:

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module swap1 \
  --function withdraw_funds \
  --args <SWAP_STATE_ID> <AMOUNT_IN_MICRO_SUI> \
  --gas-budget 100000000
```

#### b) Withdraw all funds:

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module swap1 \
  --function withdraw_all_funds \
  --args <SWAP_STATE_ID> \
  --gas-budget 100000000
```

---

### 4. View Receipt Details

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module swap1 \
  --function get_receipt_details \
  --args <SWAP_RECEIPT_ID> \
  --gas-budget 100000000
```

Returns:

* `tx_digest: vector<u8>`
* `amount_swapped: u64`
* `timestamp: u64`
* `recipient_lp: address`

---

### 5. Check if a Tx Was Processed

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module swap1 \
  --function is_processed \
  --args <SWAP_STATE_ID> <TX_DIGEST_AS_HEX_VECTOR> \
  --gas-budget 100000000
```

---

### 6. Validate a Swap Receipt

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module swap1 \
  --function is_valid_receipt \
  --args <SWAP_RECEIPT_ID> <SWAP_STATE_ID> \
  --gas-budget 100000000
```

---

### 7. Get LP Address

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module swap1 \
  --function get_lp_address \
  --args <SWAP_STATE_ID> \
  --gas-budget 100000000
```

---

### 8. Get LP Balance

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module swap1 \
  --function get_lp_balance \
  --args <SWAP_STATE_ID> \
  --gas-budget 100000000
```

---

## Objects Summary

| Object        | Description                                         |
| ------------- | --------------------------------------------------- |
| `SwapState`   | Shared object managing LP state and processed swaps |
| `SwapReceipt` | NFT confirming a user swap                          |
| `Payment`     | Record of the payment (for historical reference)    |
| `SwapEvent`   | On-chain event (for off-chain indexers)             |

---

## Permissions & Errors

| Error Code | Description                   |
| ---------- | ----------------------------- |
| 0          | Transaction already processed |
| 1          | Insufficient LP balance       |
| 3          | Sender is not contract owner  |

---

## Developer Notes

* All SUI coins must be unwrapped before passing into the `swap` function.
* Timestamps are retrieved from the on-chain `Clock`.
* LP balance is stored in a `Balance<SUI>` for native SUI handling.
* Each transaction is tracked by digest to prevent double-swap.

---

## Support

For issues or questions, feel free to open an issue or reach out to the Sui developer community.

---

