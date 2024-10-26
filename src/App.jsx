import { useEffect, useState } from 'react';
import Morph from './assets/Morph.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Web3 from 'web3';
import { abi as ABI } from "./contract/abi";
import { useWallet } from './hooks/useConnect';

const client = new Web3(window.ethereum);

function App() {
  const [number, setNumber] = useState(0);
  const { account, connectWallet, error } = useWallet();

  const store = async (number) => {
    const contract = new client.eth.Contract(ABI, '0x599d52A441Eef87f99241396ee14E4C9fFA78281');
    const data = contract.methods.store(client.utils.toWei(number.toString(), 'ether')).encodeABI();

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const fromAddress = accounts[0];
    
    const tx = {
      from: fromAddress,
      to: '0x599d52A441Eef87f99241396ee14E4C9fFA78281',
      data
    };
    
    try {
      const hash = await client.eth.sendTransaction(tx);
      console.log('Transaction hash:', hash);
      return hash;
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  const retrieve = async () => {
    const contract = new client.eth.Contract(ABI, '0x599d52A441Eef87f99241396ee14E4C9fFA78281');
    const data = await contract.methods.retrieve().call();
    return data;
  };

  useEffect(() => {
    retrieve().then((data) => {
      setNumber(client.utils.fromWei(data, 'ether'));
    });
  }, []);

  return (
    <>
      <div className="logos">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://morphl2.io" target="_blank">
          <img src={Morph} className="mlogo" alt="Morph logo" />
        </a>
      </div>
      <h1>Vite + Morph with Web3.js</h1>
      <button onClick={connectWallet}>
        {account ? account : "Connect Wallet"}
      </button>
      {account && <div className="card">
        <button onClick={() => {
          store(String(Number(number) + 1)).then(data => {
            console.log("Transaction Hash:", data);
          });
        }}>
          Number in storage is {number}
        </button>
      </div>}
    </>
  );
}

export default App;
