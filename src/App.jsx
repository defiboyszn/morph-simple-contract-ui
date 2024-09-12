import { useEffect, useState } from 'react'
import Morph from './assets/Morph.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createPublicClient, http, createWalletClient, custom, parseEther, formatEther } from 'viem'
import { morphHolesky } from 'viem/chains'
import { abi as ABI } from "./contract/abi";
import { useWallet } from './hooks/useConnect'

const client = createPublicClient({
  chain: morphHolesky,
  transport: http(),
})

const wallet_client = createWalletClient({
  chain: morphHolesky,
  transport: custom(window.ethereum)
})

function App() {
  const [number, setNumber] = useState(0);
  const { account, connectWallet, error } = useWallet();

  const store = async (number) => {
    const { request } = await client.simulateContract({
      address: '0x599d52A441Eef87f99241396ee14E4C9fFA78281',
      abi: ABI,
      functionName: 'store',
      args: [parseEther(number)],
      account
    });

    const hash = await wallet_client.writeContract(request);

    return hash;
  }
  const retrieve = async () => {
    const data = await client.readContract({
      address: '0x599d52A441Eef87f99241396ee14E4C9fFA78281',
      abi: ABI,
      functionName: 'retrieve',
      account
    });

    return data;
  }

  useEffect(() => {

    retrieve().then((data) => {
      setNumber(formatEther(data))
    })
  }, [number, setNumber]);
  return (
    <>
      <div className="logos">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://morphl2.io" target="_blank">
          <img src={Morph} className="mlogo" alt="Vite logo" />
        </a>
      </div>
      <h1>Vite + Morph</h1>
      <button onClick={connectWallet}>
        {account? account : "Connect Wallet"}
      </button>
      <div className="card">
        <button onClick={() => {
          store(String(Number(number) + 1)).then(data => {
            console.log(data);

          })
        }}>
          Number in storage is {number}
        </button>

      </div>
    </>
  )
}

export default App
