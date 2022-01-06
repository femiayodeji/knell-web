import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    console.log(ethers);
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="sheep">👋</span> Knell
        </div>

        <div className="bio">
          After a while, just staying alive becomes a full-time job. No wonder we need a vacation. 
          <p>Connect your Ethereum wallet and wave at those that're still un-dead!</p>
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at the living
        </button>
      </div>
    </div>
  );
}
