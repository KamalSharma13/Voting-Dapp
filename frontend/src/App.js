import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "./Constants/constant";
import Login from "./Components/Login";
import Connected from "./Components/Connected";
import "./App.css";
import Finished from "./Components/Finished";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState("");
  const [CanVote, setCanVote] = useState(true);

  useEffect(() => {
    getCandidates();
    getRemainingTime();
    getCurrentStatus();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  });

  async function vote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    const tx = await contractInstance.vote(number);
    await tx.wait();
    canVote();
  }

  async function canVote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const voteStatus = await contractInstance.voters(await signer.getAddress());
    setCanVote(voteStatus);
  }

  async function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  async function getCurrentStatus() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    const ContractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    const status = await ContractInstance.getVotingStatus();
    setVotingStatus(status);
  }

  async function getCandidates() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    const candidateList = await contractInstance.getAllVotedCandidates();
    const formatedList = candidateList.map((candidate, index) => {
      return {
        index: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber(),
      };
    });
    setCandidates(formatedList);
  }

  async function getRemainingTime() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    const time = await contractInstance.getRemainingTime();
    setRemainingTime(parseInt(time, 16));
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && accounts !== accounts[0]) {
      setAccount(accounts[0]);
      canVote();
    } else {
      setAccount(null);
      isConnected(false);
    }
  }

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);

        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask connected to :" + address);
        setIsConnected(true);
        canVote();
      } catch (err) {
        console.log(err);
      }
    } else {
      console.error("metamask not detected");
    }
  }
  return (
    <>
      {votingStatus ? (
        isConnected ? (
          <Connected
            account={account}
            candidates={candidates}
            votingStatus={votingStatus}
            remainingTime={remainingTime}
            number={number}
            handleNumberChange={handleNumberChange}
            showButton={CanVote}
            voteFunction={vote}
          />
        ) : (
          <Login connectWallet={connectWallet} />
        )
      ) : (
        <Finished />
      )}
    </>
  );
}

export default App;
