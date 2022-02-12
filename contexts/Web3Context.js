import React, { useState, useEffect } from 'react'
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Portis from "@portis/web3";
import WalletConnectProvider from "@walletconnect/web3-provider";

export const Web3Context = React.createContext(undefined);

export const Web3ContextProvider = ({children}) => {

  const [web3Modal, setWeb3Modal] = useState(undefined);
  const [provider, setProvider] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState("");
  const [ensAddress, setEnsAddress] = useState("");
  const [isPortisLoading, setIsPortisLoading] = useState(false);

  useEffect(() => {

    const getAddress = async () => {
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setSignerAddress(ethers.utils.getAddress(address));
      let tp = new ethers.providers.InfuraProvider("mainnet","9f34d0bf5e1b4b36914fd5bc66c50b05");
      tp.lookupAddress(address).then((ensAdd)=>{
        if(Boolean(ensAdd) == true){
          setEnsAddress(ensAdd);
        }
      });

    }
    if (provider) {
      getAddress();
    }
    else {
      setSignerAddress("");
      setEnsAddress("");
    }

  }, [provider]);

  useEffect(() => {

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
              80001: "https://polygon-mumbai.g.alchemy.com/v2/qqQIm10pMOOsdmlV3p7NYIPt91bB0TL4"
          }
        }
      },
      portis: {
        display: {
          name: "Portis",
          description: "Connect with your Email and Password"
        },
        package: Portis,
        options: {
          id: "6e01a688-29cd-43a8-a36e-5dae5c474e97",
          network: "maticMumbai"
        }
      }
    };

    let w3m = new Web3Modal({
      network: { chainId: 80001, nodeUrl: "https://polygon-mumbai.g.alchemy.com/v2/qqQIm10pMOOsdmlV3p7NYIPt91bB0TL4" },
      cacheProvider: true,
      theme: "dark",
      providerOptions,
    })

    setWeb3Modal(w3m);

  }, []);

  async function connectWallet(choice = "") {
    console.log("choice", choice);

    try {

      if (choice === "portis") {
        setIsPortisLoading(true);
      }

      let modalProvider;

      if (choice !== "") {
        modalProvider = await web3Modal.connectTo(choice);
      }
      else {
        modalProvider = await web3Modal.connect();
      }

      if (modalProvider.on) {
        modalProvider.on("accountsChanged", () => {
          window.location.reload();
        });
        modalProvider.on("chainChanged", () => {
          window.location.reload();
        });
      }
      const ethersProvider = new ethers.providers.Web3Provider(modalProvider);

      const signer = ethersProvider.getSigner();
      const address = await signer.getAddress();

      setProvider(ethersProvider);

      return address;

    } catch(e) {
      disconnectWallet();
      console.log('NO_WALLET_CONNECTED', e);
    }

    setIsPortisLoading(false);
  }

  function disconnectWallet() {
    web3Modal?.clearCachedProvider();
    setProvider(undefined);
    setSignerAddress("");
    setEnsAddress("");
  }

  return (
    <Web3Context.Provider value={{
      connectWallet,
      disconnectWallet,
      provider,
      signerAddress,
      ensAddress,
      web3Modal,
      isPortisLoading
    }}>
        {children}
    </Web3Context.Provider>
  )

}
