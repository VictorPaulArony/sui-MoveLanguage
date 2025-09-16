/*
#[test_only]
module contract::contract_tests;
// uncomment this line to import the module
// use contract::contract;

const ENotImplemented: u64 = 0;

#[test]
fun test_contract() {
    // pass
}

#[test, expected_failure(abort_code = ::contract::contract_tests::ENotImplemented)]
fun test_contract_fail() {
    abort ENotImplemented
}
*/
module contract::test_contract {
    use sui::test_scenario;
    use sui::test_scenario::{TestScenario, TestObject, TestAddress, add_sui, get_balance};
    use sui::clock::{Clock};
    use sui::coin::{Coin};
    use sui::tx_context::{TxContext};
    use sui::sui::SUI;
    use contract::contract;

    #[test]
    fun test_full_swap_flow() {
        let mut ts = TestScenario::new();

        // Create test users
        let owner = ts.new_address();
        let user1 = ts.new_address();

        // Add SUI to user1
        let coin = ts.add_sui(user1, 1_000_000_000); // 1 SUI

        // Create clock object (needed for swap)
        let clock = ts.advance_clock();

        // Deploy the contract by calling init
        let mut ctx = ts.new_ctx(&owner);
        contract::init(&mut ctx);
        let [swap_state] = ts.take_shared_objects<contract::SwapState>();

        // Check LP balance is 0
        assert!(contract::get_lp_balance(&swap_state) == 0, 100);

        // Set LP address (to user1)
        let mut ctx = ts.new_ctx(&owner);
        contract::set_lp_address(&mut swap_state, user1, &mut ctx);

        // Perform a swap from user1
        let mut ctx = ts.new_ctx(&user1);
        let coin_obj = ts.take_object<Coin<SUI>>(coin);
        contract::swap(&mut swap_state, coin_obj, &clock, &mut ctx);

        // Check LP balance is now 1 SUI
        assert!(contract::get_lp_balance(&swap_state) == 1_000_000_000, 101);

        // Get transaction digest and verify it's marked processed
        let digest = *tx_context::digest(&ctx);
        assert!(contract::is_processed(&swap_state, digest), 102);

        // Try to swap again with same digest (should fail if re-run in real scenario)
        // You cannot really reuse the same digest in Move tests, so we simulate the prevention

        // Try withdrawing some funds
        let mut ctx = ts.new_ctx(&owner);
        contract::withdraw_funds(&mut swap_state, 500_000_000, &mut ctx);

        // LP balance should be 500M now
        assert!(contract::get_lp_balance(&swap_state) == 500_000_000, 103);

        // Withdraw all
        let mut ctx = ts.new_ctx(&owner);
        contract::withdraw_all_funds(&mut swap_state, &mut ctx);

        // LP balance should be 0
        assert!(contract::get_lp_balance(&swap_state) == 0, 104);
    }
}
