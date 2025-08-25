/*
/// Module: eventexample1
module eventexample1::eventexample1;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module eventexample1::eventexample1;

use sui::coin::{Self, Coin};
use sui::event;
use sui::sui::SUI;
use sui::test_scenario::{Self as test};

public struct Payment has copy, drop {
    recipient: address,
    amount: u64,
    sender: address,
}

public fun send_payment(recipient: address, payment: Coin<SUI>, ctx: &mut TxContext) {
    let amount = coin::value(&payment);
    let sender = tx_context::sender(ctx);

    //emit the event
    event::emit(Payment {
        recipient,
        amount,
        sender,
    });

    //transfer sui coins to the recipent
    transfer::public_transfer(payment, recipient);
}

#[test]
public fun test_send_payment() {
    let mut scenario = test::begin(@0x1);
    let recipient = @0x2;
    let amount = 1000;

    // Create a test coin
    let coin = coin::mint_for_testing<SUI>(amount, test::ctx(&mut scenario));

    // Call send_payment function
    send_payment(recipient, coin, test::ctx(&mut scenario));

    test::end(scenario);
}
