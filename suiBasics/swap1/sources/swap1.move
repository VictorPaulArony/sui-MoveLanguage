#[allow(lint(public_entry))]
module swap1::swap1;

// use sui::clock::{Self, Clock};
// use sui::coin::{Self, Coin};
// use sui::event;
// use sui::sui::SUI;
use sui::vec_set::{Self, VecSet};

/// Struct to hold the record of each swap
public struct Payment has key {
    id: UID,
    sender: address,
    amount: u64,
    timestamp: u64,
    tx_digest: vector<u8>,
}

/// Event to be emitted for offchain system
public struct SwapEvent has copy, drop, store {
    sender: address,
    lp_address: address,
    amount: u64,
    timestamp: u64,
    tx_digest: vector<u8>,
}

public struct SwapState has key {
    id: UID,
    owner_address: address,
    lp_address: address,
    processed_tx_digests: VecSet<vector<u8>>,
}

/// Error codes
    // const EALREADY_PROCESSED: u64 = 0;
    // const EINSUFFICIENT_BALANCE: u64 = 1;
    // const EINVALID_LP_ADDRESS: u64 = 2;
    const ENOT_OWNER: u64 = 3;

/// The SwapReceipt is an NFT that the user receives.
/// It serves as a personal, immutable record of their transaction.
public struct SwapReceipt has key, store {
    id: UID,
    tx_digest: vector<u8>,
    amount_swapped: u64,
    timestamp: u64,
    recipient_lp: address,
}

/// Assigns the contract's publisher as the initial owner.
fun init(ctx: &mut TxContext) {
    let publisher_address = tx_context::sender(ctx);
    let state = SwapState {
        id: object::new(ctx),
        owner_address: publisher_address,
        lp_address: publisher_address,
        processed_tx_digests: vec_set::empty(),
    };
    transfer::share_object(state);
}

/// Set the liquidity provider address
    public entry fun set_lp_address(
    swap_state: &mut SwapState,
    new_lp_address: address,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    assert!(sender == swap_state.owner_address, ENOT_OWNER);

    swap_state.lp_address = new_lp_address;
}

