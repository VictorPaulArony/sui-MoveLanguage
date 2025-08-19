// This module demonstrates the use of the `copy` ability in Move.
module structs::copy_example;

use std::debug;

// A struct `Points` with two `u32` fields.
public struct Points has copy, drop {
    x: u32,
    y: u32,
}

// This function demonstrates copying behavior.
public fun use_points() {
    // Create a `Points` instance named `p1`.
    let p1 = Points { x: 3, y: 4 };

    // `p2 = p1` does not *move* `p1` into `p2`; it *copies* the value.
    let p2 = p1;

    // You can now use both `p1` and `p2` independently.
    debug::print(&p1);
    debug::print(&p2);
}

// Unit test for `use_points`
#[test]
fun test_use_points() {
    // Same logic as above, in a test function.
    let p1 = Points { x: 3, y: 4 };
    let p2 = p1;

    debug::print(&p1);
    debug::print(&p2);
}
