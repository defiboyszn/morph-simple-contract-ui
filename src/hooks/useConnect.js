import { useState, useEffect } from 'react';

export const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  // Function to connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request wallet connection
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Set the first connected account
        setAccount(accounts[0]);
        setError(null);  // Clear any previous error
      } catch (err) {
        // Handle error if user rejects the request or if there's another issue
        setError('User rejected the connection request or an error occurred.');
      }
    } else {
      setError('No Ethereum provider found. Please install MetaMask.');
    }
  };

  // Optionally: Detect account change or network change
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null); // Disconnected
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  return { account, connectWallet, error };
};
