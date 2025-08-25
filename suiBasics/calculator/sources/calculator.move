/*
/// Module: calculator
module calculator::calculator;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module calculator::calculator;
    use std::debug;


public fun calculator(a: u64, b:u64) {
    let sub = a-b;
    let sum = a+b;
    let mod = a%b;
    let div = a/b;
    let mult = a*b;

    debug::print(&sum);
    debug::print(&sub);
    debug::print(&mod);
    debug::print(&div);
    debug::print(&mult);
}

#[test]
public fun test_calculator() {
    calculator(130,14)
}
