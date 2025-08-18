/*
/// Module: strings
module strings::strings;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module strings::strings;

use 0x1::string;

public struct Sample has key, store {
    id: UID,
    name: string::String,
}

public fun mint(ctx: &mut TxContext) {
    let name = string::utf8(b"Simple things in sui");
    let obj = Sample {
        id: object::new(ctx),
        name,
    };
    transfer::share_object(obj);
}
