#[allow(lint(public_entry))]
module swap1::swap1;

use sui::balance::{Self, Balance};
use sui::clock::{Self, Clock};
use sui::coin::{Self, Coin};
use sui::event;
use sui::sui::SUI;
use sui::vec_set::{Self, VecSet};

// Struct to hold the record of each swap
public struct Payment has key, store {
    id: UID,
    sender: address,
    amount: u64,
    timestamp: u64,
    tx_digest: vector<u8>,
}

// Event to be emitted for offchain system
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
    lp_balance: Balance<SUI>,
    processed_tx_digests: VecSet<vector<u8>>,
}

// Error codes
const EINSUFFICIENT_BALANCE: u64 = 1;
// const EINVALID_LP_ADDRESS: u64 = 2;
const EALREADY_PROCESSED: u64 = 0;
const ENOT_OWNER: u64 = 3;

// The SwapReceipt is an NFT that the user receives.
// It serves as a personal, immutable record of their transaction.
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
        lp_balance: balance::zero(),
        processed_tx_digests: vec_set::empty(),
    };
    transfer::share_object(state);
}

/// Set the liquidity provider address
public entry fun set_lp_address(
    swap_state: &mut SwapState,
    new_lp_address: address,
    ctx: &mut TxContext,
) {
    let sender = tx_context::sender(ctx);
    assert!(sender == swap_state.owner_address, ENOT_OWNER);

    swap_state.lp_address = new_lp_address;
}

// Main swap function - automatically handles coins and timestamps
public entry fun swap(
    swap_state: &mut SwapState,
    coin: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let tx_digest = *tx_context::digest(ctx);

    // Check if this transaction has already been processed
    assert!(!vec_set::contains(&swap_state.processed_tx_digests, &tx_digest), EALREADY_PROCESSED);

    let amount = coin::value(&coin);
    let sender = tx_context::sender(ctx);
    let timestamp = clock::timestamp_ms(clock);

    // Add funds to LP balance
    balance::join(&mut swap_state.lp_balance, coin::into_balance(coin));

    // Create payment record
    let payment = Payment {
        id: object::new(ctx),
        sender,
        amount,
        timestamp,
        tx_digest: copy tx_digest,
    };

    // Create SwapReceipt NFT for the user
    let swap_receipt = SwapReceipt {
        id: object::new(ctx),
        tx_digest: copy tx_digest,
        amount_swapped: amount,
        timestamp,
        recipient_lp: swap_state.lp_address,
    };

    // Add to processed transactions
    vec_set::insert(&mut swap_state.processed_tx_digests, tx_digest);

    // Emit event
    event::emit(SwapEvent {
        sender,
        lp_address: swap_state.lp_address,
        amount,
        timestamp,
        tx_digest,
    });

    // Transfer payment record to sender
    transfer::public_transfer(payment, sender);

    // Transfer SwapReceipt NFT to sender
    transfer::public_transfer(swap_receipt, sender);
}


// Check if a transaction has been processed
public fun is_processed(swap_state: &SwapState, tx_digest: vector<u8>): bool {
    vec_set::contains(&swap_state.processed_tx_digests, &tx_digest)
}

/// Get LP balance amount
public fun get_lp_balance(swap_state: &SwapState): u64 {
    balance::value(&swap_state.lp_balance)
}

// Get the current LP address
public fun get_lp_address(swap_state: &SwapState): address {
    swap_state.lp_address
}

/// Withdraw funds from the contract (owner only)
public entry fun withdraw_funds(swap_state: &mut SwapState, amount: u64, ctx: &mut TxContext) {
    assert!(tx_context::sender(ctx) == swap_state.owner_address, ENOT_OWNER);

    // Check if there's enough balance
    let current_balance = balance::value(&swap_state.lp_balance);
    assert!(current_balance >= amount, EINSUFFICIENT_BALANCE);

    // Create a new balance with the requested amount
    let balance_to_withdraw = balance::split(&mut swap_state.lp_balance, amount);

    // Convert balance to coin and transfer to owner
    let coin = coin::from_balance(balance_to_withdraw, ctx);
    transfer::public_transfer(coin, swap_state.owner_address);
}

// Withdraw all funds from the contract (owner only)
public entry fun withdraw_all_funds(swap_state: &mut SwapState, ctx: &mut TxContext) {
    assert!(tx_context::sender(ctx) == swap_state.owner_address, ENOT_OWNER);

    let total_balance = balance::value(&swap_state.lp_balance);
    if (total_balance > 0) {
        // Take the entire balance
        let balance_to_withdraw = balance::split(&mut swap_state.lp_balance, total_balance);
        let coin = coin::from_balance(balance_to_withdraw, ctx);
        transfer::public_transfer(coin, swap_state.owner_address);
    }
}

// View function to get receipt details
public fun get_receipt_details(receipt: &SwapReceipt): (vector<u8>, u64, u64, address) {
    (receipt.tx_digest, receipt.amount_swapped, receipt.timestamp, receipt.recipient_lp)
}

/// Check if a receipt is valid for a given transaction
public fun is_valid_receipt(receipt: &SwapReceipt, swap_state: &SwapState): bool {
    vec_set::contains(&swap_state.processed_tx_digests, &receipt.tx_digest)
}
