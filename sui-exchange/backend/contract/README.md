
## Side-by-Side Summary
| Function          | Accepts     | Sends To LP           | Returns to User         |
| ----------------- | ----------- | --------------------- | ----------------------- |
| `swap_sui_to_ksh` | `Coin<SUI>` | Sends to `lp_address` | (assumed) off-chain KSH |
| `swap_ksh_to_sui` | `Coin<KSH>` | Sends to `lp_address` | Sends `Coin<SUI>`       |


## Architecture (SUI ↔ KSH Swap)
| Direction      | Action                                                        | Balance Impact         |
| -------------- | ------------------------------------------------------------- | ---------------------- |
| SUI → KSH      | User sends SUI, contract stores it, LP receives KSH off-chain | `lp_balance` increases |
| KSH → SUI      | User sends KSH, contract sends SUI to user                    | `lp_balance` decreases |
| Admin Top-up   | Admin sends SUI to contract                                   | `lp_balance` increases |
| Admin Withdraw | Admin pulls excess SUI from contract                          | `lp_balance` decreases |
