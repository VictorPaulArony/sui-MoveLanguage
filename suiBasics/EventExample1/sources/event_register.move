//a module that emits an event whenever a user registers by providing a username.
module eventexample1::event_register;

use sui::event;

public struct UserRegister has copy, drop {
    user: address,
    username: vector<u8>,
}

public fun register_user(username: vector<u8>, ctx: &mut TxContext) {
    let user = tx_context::sender(ctx);

    //emit the registration event
    event::emit(UserRegister { user, username })
}

#[test]
public fun test_register_user() {
    let mut ctx = tx_context::dummy();
    let username = b"Victor Paul Arony";
    register_user(username, &mut ctx);
}
