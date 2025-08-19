module structs::drop_example;

use std::debug;

/// A struct that can be copied and dropped
public struct Point has copy, drop {
    x: u64,
    y: u64,
}

/// A function that creates a Point but does nothing with it
public fun drop_point_example() {
    let _p = Point { x: 1, y: 2 };
    // No need to use _p — because Point has `drop`, this is allowed.

    // Just to show that the function runs
    debug::print(&10);
}

#[test]
fun test_drop_point_example() {
    drop_point_example();
}
