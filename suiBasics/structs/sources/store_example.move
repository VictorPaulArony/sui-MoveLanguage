module structs::store_example;

/// A struct that can be stored (e.g., inside an on-chain object)
public struct MyData has store {
    value: u64,
}

/// A struct that will be stored as an on-chain object (has `key`)
public struct Container has key, store {
    id: UID,
    data: MyData,
}

/// Entry function to create and store the container on-chain
public fun create_container(ctx: &mut sui::tx_context::TxContext): Container {
    let id = sui::object::new(ctx);
    let data = MyData { value: 42 };
    Container { id, data }
}

#[test]
public fun test_create_container() {
    use std::debug;
    use sui::test_scenario;
    let sender = @0x42;
    let mut scenario = test_scenario::begin(sender);
    let ctx = test_scenario::ctx(&mut scenario);

    let container = create_container(ctx);
    debug::print(&container.data.value);

    //Properly consume the container by deconstructing it
    let Container { id, data } = container;
    let MyData { value } = data;

    //Use UID and value so they are consumed
    object::delete(id);
    let _ = value;

    //scenario must be passed to a function that consumes it
    test_scenario::end(scenario);
}
