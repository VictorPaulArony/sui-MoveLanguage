import React, { useState } from "react";
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useWallet } from '@suiet/wallet-kit';

const PACKAGE_ID = '0xbd759b33812ba356760e6ffc5d8955615ac4965d7849d5ab505b60101cd12393';
const MODULE_NAME = 'contract';
const SWAP_STATE_ID = '0xfcb7bb07e195d50d5b18f21aa70be39af5fcefa966d1b9083d3c25450a23b2aa';

const AdminControls = () => {
  const wallet = useWallet();
  const [newLpAddress, setNewLpAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [adminError, setAdminError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper to show success message
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  // Withdraw funds
  const handleWithdrawFunds = async () => {
    setAdminError("");
    setLoading(true);
    try {
      const tx = new TransactionBlock();
      // Convert SUI to MIST (1 SUI = 1_000_000_000 MIST)
      const mistAmount = Math.round(Number(withdrawAmount) * 1e9);
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::withdraw_funds`,
        arguments: [tx.object(SWAP_STATE_ID), tx.pure(mistAmount)],
      });
      await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: { showEvents: true, showEffects: true },
      });
      showSuccess("Funds withdrawn successfully.");
    } catch (err) {
      setAdminError("Failed to withdraw funds.");
    } finally {
      setLoading(false);
    }
  };

  // Withdraw all funds
  const handleWithdrawAllFunds = async () => {
    setAdminError("");
    setLoading(true);
    try {
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::withdraw_all_funds`,
        arguments: [tx.object(SWAP_STATE_ID), tx.pure(wallet.account.address)],
      });
      await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: { showEvents: true, showEffects: true },
      });
      showSuccess("All funds withdrawn successfully.");
    } catch (err) {
      setAdminError("Failed to withdraw all funds.");
    } finally {
      setLoading(false);
    }
  };

  // Set LP address
  const handleSetLpAddress = async () => {
    setAdminError("");
    setLoading(true);
    try {
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::set_lp_address`,
        arguments: [tx.object(SWAP_STATE_ID), tx.pure(newLpAddress)],
      });
      await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: { showEvents: true, showEffects: true },
      });
      showSuccess("LP address updated successfully.");
    } catch (err) {
      setAdminError("Failed to set LP address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-2xl shadow-xl border border-blue-700">
      <h2 className="text-3xl font-bold text-white mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Admin Controls</h2>
      <div className="bg-white/90 rounded-xl border border-gray-200 shadow-lg p-8 space-y-6">
        <div className="flex gap-2 items-center">
          <input type="text" value={newLpAddress} onChange={e => setNewLpAddress(e.target.value)} placeholder="New LP Address" className="input px-4 py-3 rounded-lg border border-blue-300 w-full" />
          <button onClick={handleSetLpAddress} className="btn py-3 font-bold rounded-xl bg-green-600 text-white">Set LP Address</button>
        </div>
        <div className="flex gap-2 items-center">
          <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="Withdraw Amount (SUI)" className="input px-4 py-3 rounded-lg border border-blue-300 w-full" />
          <button onClick={handleWithdrawFunds} className="btn py-3 font-bold rounded-xl bg-yellow-600 text-white">Withdraw Funds</button>
        </div>
        <button onClick={handleWithdrawAllFunds} className="btn w-full py-3 font-bold rounded-xl bg-red-600 text-white">Withdraw All Funds</button>
        {adminError && <div className="mt-2 p-3 bg-red-100 border border-red-400 rounded text-red-700 text-center font-semibold">{adminError}</div>}
        {successMsg && <div className="mt-2 p-3 bg-green-100 border border-green-400 rounded text-green-700 text-center font-semibold">{successMsg}</div>}
      </div>
    </div>
  );
};

export default AdminControls;
