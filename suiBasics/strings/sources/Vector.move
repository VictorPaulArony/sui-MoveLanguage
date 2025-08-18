module strings::Vector;

public struct Sample has key, store {
    id: UID,
    name: vector<u8>,
}

public fun mintVector(ctx: &mut TxContext) {
    let name = b"Simple things in sui";
    let sample = Sample { id: object::new(ctx), name };
    transfer::share_object(sample);
}
