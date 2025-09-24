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
    use sui::test_scenario::{TestScenario, get_balance};
    use sui::coin::Coin;
    use sui::sui::SUI;

    use contract::contract;

    #[test]
    fun test_full_swap_flow() {
        let mut ts = TestScenario::new();

        // Create test addresses
        let owner = ts.new_address();
        let user1 = ts.new_address();

        // Give user1 1 SUI (1_000_000_000 mist)
        let coin = ts.add_sui(user1, 1_000_000_000);

        // Initialize clock (required for swap function)
        let clock = ts.advance_clock();

        // Call contract::init() with owner
        let mut ctx = ts.new_ctx(&owner);
        contract::init(&mut ctx);

        // Take the SwapState object from shared storage
        let [mut swap_state] = ts.take_shared_objects<contract::SwapState>();

        // Check initial LP balance is zero
        assert!(contract::get_lp_balance(&swap_state) == 0, 100);

        // Set LP address to user1 (so they "own" LP side of swap)
        let mut ctx = ts.new_ctx(&owner);
        contract::set_lp_address(&mut swap_state, user1, &mut ctx);

        // Perform swap_sui_to_ksh from user1
        let mut ctx = ts.new_ctx(&user1);
        let coin_obj = ts.take_object<Coin<SUI>>(coin);
        contract::swap_sui_to_ksh(&mut swap_state, coin_obj, &clock, &mut ctx);

        // After swap, LP balance should now be 1 SUI
        assert!(contract::get_lp_balance(&swap_state) == 1_000_000_000, 101);

        // Get tx digest and check if marked as processed
        let digest = *tx_context::digest(&ctx);
        assert!(contract::is_processed(&swap_state, digest), 102);

        // Try withdrawing 0.5 SUI (500_000_000) by owner
        let mut ctx = ts.new_ctx(&owner);
        contract::withdraw_funds(&mut swap_state, 500_000_000, &mut ctx);
        assert!(contract::get_lp_balance(&swap_state) == 500_000_000, 103);

        // Now withdraw all remaining funds
        let mut ctx = ts.new_ctx(&owner);
        contract::withdraw_all_funds(&mut swap_state, &mut ctx);
        assert!(contract::get_lp_balance(&swap_state) == 0, 104);
    }
}

