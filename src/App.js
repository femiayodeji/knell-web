import { ethers } from "ethers";
import React, {useEffect, useState} from "react";
import './App.css';
import WavePortalABI from "./utils/WavePortal.json";

const contractAddress = "0x6d61c51541d01DbC3E44825846E54B3Bea0cD21f";
const contractABI = WavePortalABI.abi;

async function getWaveCount() {
  const {ethereum} = window;
  if(ethereum){
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      let count = await wavePortalContract.getTotalWaves();
      return count.toNumber();
  } else {
    console.log("Ethereum object doesn't exist!");
  }  
}

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [waveCount, setWaveCount] = useState(0);

  const checkIfWalletIsConnected = async () => {
    try{
      const {ethereum} = window;

      if(ethereum){
        console.log("Make sure you have metamask!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      const accounts = await ethereum.request({method: "eth_accounts"});

      if(accounts.length === 0){
        console.log("No authorized account found");
      } else {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        const count = await getWaveCount();
        setWaveCount(count);
      }
    } catch(error){
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      const count = await getWaveCount();
      setWaveCount(count);
    } catch (error) {
      console.log(error)
    }
  }
  
  const wave = async () => {
    try{
      const {ethereum} = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber())

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining..", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setWaveCount(count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
}, []);

  return (
    <div className="page-wrapper">
      <div className="mainContainer">

        <div className="dataContainer">
          <div className="header">
            <span role="img" aria-label="wave">👋</span> Knell
          </div>

          <div className="waveCount">
            <span className="waveCounter">
              {waveCount}
              <span role="img" aria-label="wave">👋</span>
            </span>
          </div>
        
          <div className="bio">
            <p>After a while, just staying alive becomes a full-time job. No wonder we need a vacation.</p> 
            <p>Connect your Ethereum wallet and wave at those that're still un-dead!</p>
          </div>

          {currentAccount && (
            <button className="waveButton" onClick={wave}>
              Wave
            </button>
          )}

          {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        </div>
      </div>      
    </div>
  );
}
