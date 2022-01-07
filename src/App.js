import { ethers } from "ethers";
import React, {useEffect, useState} from "react";
import './App.css';
import WavePortalABI from "./utils/WavePortal.json";

const contractAddress = "0x4B34C7A9c3aF0D78AeaF9DB5Cf370005074aaa04";
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

const getAllWaves = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      const waves = await wavePortalContract.getAllWaves();

      let wavesCleaned = [];
      waves.forEach(wave => {
        wavesCleaned.push({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message
        });
      });
      wavesCleaned.reverse();
      return wavesCleaned;
    } else {
      console.log("Ethereum object doesn't exist!")
    }
  } catch (error) {
    console.log(error);
  }
}

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [waveCount, setWaveCount] = useState(0);
  const [waveStatusText, setWaveStatusText] = useState("Wave");
  const [waveStatus, setWaveStatus] = useState(false);
  const [allWaves, setAllWaves] = useState([]);

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
        const waves = await getAllWaves();
        setAllWaves(waves);
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

        const waveTxn = await wavePortalContract.wave("This is a testing message");
        console.log("Mining..", waveTxn.hash);
        setWaveStatusText("Waving..");
        setWaveStatus(true);
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        setWaveStatusText("Waved");
        setWaveStatus(false);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setWaveCount(count.toNumber());
        
        const waves = await getAllWaves();
        setAllWaves(waves);

        setWaveStatusText("Wave again");

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // const getAllWaves = async () => {
  //   try {
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  //       const waves = await wavePortalContract.getAllWaves();

  //       let wavesCleaned = [];
  //       waves.forEach(wave => {
  //         wavesCleaned.push({
  //           address: wave.waver,
  //           timestamp: new Date(wave.timestamp * 1000),
  //           message: wave.message
  //         });
  //       });
  //       wavesCleaned.reverse();
  //       setAllWaves(wavesCleaned);
  //     } else {
  //       console.log("Ethereum object doesn't exist!")
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

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
            <button className="waveButton" onClick={wave} disabled={waveStatus}>
              {waveStatusText}
            </button>
          )}

          {!currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}

          <div className="waves">
            {allWaves.map((wave, index) => {
              return (
                <div key={index} className="waveItem">
                  <div><strong>Message: {wave.message}</strong></div>
                  <div>Address: {wave.address}</div>
                  <div>Time: {wave.timestamp.toString()}</div>
                </div>)
            })}
          </div>

        </div>
      </div>      
    </div>
  );
}
