import { useState, useCallback, useEffect } from 'react';
import {
  ConnectButton,
  useWallet
} from "@suiet/wallet-kit";

export const UseWallet = () => {

    const wallet = useWallet();

  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [suiBalance, setSuiBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    try {

      await wallet.connect();

       if (wallet.connected && wallet.account?.address) {
        setIsConnected(true);
        setWalletAddress(wallet.account.address);

        if (wallet.balance != null) {
          setSuiBalance(wallet.balance.toString());
        }
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [wallet]);

  useEffect(() => {
    if (wallet.connected && wallet.account?.address) {
      setIsConnected(true);
      setWalletAddress(wallet.account.address);
      if (wallet.balance != null) {
        setSuiBalance(wallet.balance);
      }
    } else {
      setIsConnected(false);
      setWalletAddress('');
      setSuiBalance('0');
    }
  }, [wallet.connected, wallet.account, wallet.balance]);


  return {
    isConnected,
    walletAddress,
    suiBalance,
    isConnecting,
    connectWallet,
    setSuiBalance
  };
};