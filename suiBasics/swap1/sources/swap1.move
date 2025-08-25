#[allow(lint(public_entry))]
module swap1::swap1;

use sui::clock::{Self, Clock};
use sui::coin::{Self, Coin};
use sui::event;
use sui::sui::SUI;
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

/// Change the LP address. Only the contract's owner can call this.
public entry fun set_lp_address(state: &mut SwapState, new_lp_address: address, ctx: &TxContext) {
    assert!(tx_context::sender(ctx) == state.owner_address, 1);
    state.lp_address = new_lp_address;
}

#[allow(lint(self_transfer))]
public entry fun swap_sui_to_fiat(
    state: &mut SwapState,
    sui_coin: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let sender = tx_context::sender(ctx);
    let lp_addr = state.lp_address;
    let amount = coin::value(&sui_coin);
    let tx_digest = clone_vector_u8(tx_context::digest(ctx));// Clone once and reuse
    let timestamp = clock::timestamp_ms(clock);

    // Check for replay
    assert!(!vec_set::contains(&state.processed_tx_digests, &tx_digest), 1);

    // Transfer SUI to LP
    transfer::public_transfer(sui_coin, lp_addr);

    // Create Payment
    let payment_obj = Payment {
        id: object::new(ctx),
        sender,
        amount,
        timestamp,
        tx_digest: clone_vector_u8(&tx_digest),
    };
    transfer::share_object(payment_obj);

    // Mint SwapReceipt NFT
    let receipt_nft = SwapReceipt {
        id: object::new(ctx),
        tx_digest: clone_vector_u8(&tx_digest),
        amount_swapped: amount,
        timestamp,
        recipient_lp: lp_addr,
    };
    transfer::public_transfer(receipt_nft, sender);

    // Mark digest as processed
    vec_set::insert(&mut state.processed_tx_digests, tx_digest);

    // Emit event
    event::emit(SwapEvent {
        sender,
        lp_address: lp_addr,
        amount,
        timestamp,
        tx_digest: clone_vector_u8(&tx_digest),
    });
}

/// Destroy the Payment object once fiat is delivered off-chain.
public entry fun mark_payment_as_processed(
    _state: &mut SwapState,
    payment_obj: Payment,
    _clock: &Clock,
) {
    let Payment { id, sender: _, amount: _, tx_digest: _, timestamp: _ } = payment_obj;
    object::delete(id);
}

/// Utility to clone vector<u8>
fun clone_vector_u8(v: &vector<u8>): vector<u8> {
    let mut new_vec = vector::empty<u8>();
    let mut i = 0;
    let len = vector::length(v);
    while (i < len) {
        let byte_ref = vector::borrow(v, i);
        vector::push_back(&mut new_vec, *byte_ref);
        i = i + 1;
    };
    new_vec
}
