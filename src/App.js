import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    console.log(ethers);
  }
  
  return (
    <div className="page-wrapper">
      <div className="mainContainer">

        <div className="dataContainer">
          <div className="header">
            <span role="img" aria-label="wave">👋</span> Knell
          </div>

          <div className="bio">
            <p>After a while, just staying alive becomes a full-time job. No wonder we need a vacation.</p> 
            <p>Connect your Ethereum wallet and wave at those that're still un-dead!</p>
          </div>

          <button className="waveButton" onClick={wave}>
            Wave
          </button>
        </div>
      </div>      
    </div>
  );
}
