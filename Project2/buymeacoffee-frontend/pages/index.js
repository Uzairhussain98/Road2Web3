import abi from '../utils/BuyMeACoffee.json';
import { ethers } from "ethers";
import Head from 'next/head'
import React, { useEffect, useState } from "react";
import styles from '../styles/Home.module.css'
import gif from '../styles/coffee.gif' 
import coffee from '../styles/coffee.jpg' 
import Image from "next/image";
import { InfinitySpin  } from 'react-loader-spinner'
import { Fade } from "react-awesome-reveal";




export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0x49b00F780b663dB3aC08118d75c5347fb580b943";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState('');
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);
  const [buying, setBuying] = useState(false);


  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  }

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({method: 'eth_accounts'})
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        console.log("please install MetaMask");
        alert("Please Install Wallet")
      }
      
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const buyCoffee = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        if ( name =="" || message == ""){
          alert("Please Input Your Name And Message Properly")
        }

        else{
        console.log("buying coffee..")
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "anon",
          message ? message : "Enjoy your coffee!",
          {value: ethers.utils.parseEther("0.001")}
        );
        setBuying(true)

        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");

        // Clear the form fields.
        setName("");
        setMessage("");
        setBuying(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


  const buyLCoffee = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        if ( name == "" || message == ''){
          alert("Please Input Your Name And Message Properly")
        }

        else{
        console.log("buying Large coffee..")
        
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "anon",
          message ? message : "Enjoy your coffee!",
          {value: ethers.utils.parseEther("0.005")}
        );
        setBuying(true)


        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");
        setBuying(false)
        }
        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };


  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        
        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  
  
  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ]);
    };

    const {ethereum} = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    }
  }, []);
  
  if (buying){
  return (
    <div className={styles.loading}>
      <Head>
        <title>Buy Me A Coffee!</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
      <InfinitySpin 
        width='200'
        color="yellow"
/>

        <h1>
          Buying Coffee
        </h1>
    </div>
    </div>
    )
  }


  // MAIn Page
  return (
    <div className={styles.container}>
      <Head>
        <title>Buy Me A Coffee!</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
      <Image
      src={gif}
      alt="Picture of the author"
      width="350px"
      height="300px"
    />

        <h1 className={styles.title}>
          Buy me a coffee!
        </h1>
        
        {currentAccount ? (
          <div className={styles.section}>
            <form className={styles.formm}>
              <div>
              <label className={styles.label}>
                  Name
                </label>
                <br/>
                
                <input
                  className={styles.inputfield}
                  id="name"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={onNameChange}
                  />
              </div>
              <br/>
              <div>
                <label className={styles.label}>
                  Send Me A Message
                </label>
                <br/>

                <textarea
                className={styles.inputfield}
                  rows={3}
                  placeholder="Enjoy your coffee!"
                  id="message"
                  onChange={onMessageChange}
                  value={message}
                  required
                >
                </textarea>
              </div>
              <div className={styles.btncontainer}>
                <button 
                className={styles.butn}
                  type="button"
                  onClick={buyCoffee}
                >
                  Send 1 Coffee for 0.001ETH
                </button>
                <button 
                className={styles.butn}
                  type="button"
                  onClick={buyLCoffee}
                >
                  Send 1 Large Coffee for 0.005ETH
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button onClick={connectWallet} className={styles.butn}> Connect your wallet </button>
        )}
      </main>

      {currentAccount && (<h1 style={{color:"yellow"}}>Memos received</h1>)}

      {currentAccount && (memos.slice(5).reverse().map((memo, idx) => {
        return (
          <Fade direction="up" duration={2000} key={idx} >
          <div key={idx} style={{backgroundColor:"whitesmoke" , width: '400px',border:"2px solid", "borderRadius":"5px", padding: "5px", margin: "5px"}}>
            <p style={{"fontWeight":'bold'}}>`{memo.message}`</p>
            <p>From: {memo.name} at {memo.timestamp.toString()}</p>
          </div>
          </Fade>
        )
      }))}

      <footer className={styles.footer}>
        <a
          href="https://www.linkedin.com/in/uzair-hussain-00b1b01a0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by @UzairHussain by using Solidity, Hardhat and Alchemy deployed on Goerli testnet!
        </a>
      </footer>
    </div>
  )
    
}
