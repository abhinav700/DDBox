//import DStorage from '../abis/DStorage.json'
import React, { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import DDBox from '../artifacts/src/contracts/DDBox.sol/DDBox.json'
import Navbar from './Navbar'
import Main from './Main'
import { Buffer } from "buffer";
import './App.css';
let axios = require('axios');
let FormData = require('form-data');
let fs = require('fs')
let ethers = require("ethers")
let filesCount;
const App = () => {
  const [account, setAccount] = useState();
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false);
  // const [files, setFiles] = useState([]);
  const [ddBox, setddBox] = useState();
  const [buffer, setBuffer] = useState(null);
  const [selectedFile,setSelectedFile]=useState();
  useEffect(() => {
    loadBlockchainData();
  }, []);

  //Because of the async nature of useState hook, we needed useEffect.
  // useEffect(() => {
  //   console.log("buffer is : ", buffer);
  // }, [buffer]);


  const loadBlockchainData = async () => {
    //Declare Web3
    new Promise(async (resolve, reject) => {
      let provider = await detectEthereumProvider();

      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
        // console.log( provider);
        const networkId = await provider.request({ method: 'net_version' })
        provider = new ethers.providers.Web3Provider(provider);
        const signer = provider.getSigner();
        const dummy = await provider.getNetwork()
        // console.log("network id is"+networkId)
        // console.log("dummy is "+dummy);
        let accounts = await provider.listAccounts();
        setAccount(accounts[0])
        // console.log(accounts)
        let myContract = new ethers.Contract(
          '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          DDBox.abi,
          signer
        )
        setddBox(myContract);

        //@Get files amount
        //we are not accessing through ddBox letiable because setddBox is
        //an async function and will return fileCount undefined type of error

         filesCount = await myContract.fileCount.call();
        // console.log("filesCount is " + filesCount);

        //Load files&sort by the newest

          for (let i = filesCount; i >= 1; i--) {
            let file=await myContract.files(i) ;
            setFiles(files=>[...files,file]  );
            // console.log(files)
          
        }
       
        resolve({ DDBox });
        return;
      }
      reject('Install Metamask');
    });
  }

  //@Get file from user
  // for uploading it to ipfs,we have to process it and convert into a certain format. that is the purpose
  // of this function
  
  const captureFile = event => {
    event.preventDefault();
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  }
  
  const uploadFile = async description => {
    console.log("thisi is description",description)
    let name =selectedFile.name;
    let type=selectedFile.type;

    const data=new FormData();
    data.append('file', selectedFile);
    const metadata = JSON.stringify({
      name: `${selectedFile.name}`,
    });
    data.append('pinataMetadata', metadata);


    // console.log("data is : ", data)
    const jwt = process.env.REACT_APP_JWT;
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'


    let res;
    try { 
      res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
        maxBodyLength: "Infinity",
        headers: {
          Authorization: `Bearer ${jwt}`,
        }
      });
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }

console.log(res.data)
    // console.log(selectedFile.size, res.data.IfpsHash, type, name, description)
    //  Set state to loading
    setLoading(true);
    //Assign value for the file without extension
    if (type == null) {
      type='none';
    }
        const callMethod = async () => {
          try {
              const tx = await ddBox.functions.uploadFile(selectedFile.size, res.data.IpfsHash, type, name, description);
            // console.log("transaction is : ", tx)
            // console.log(tx.hash)
            setLoading(false);
            window.location.reload()
          } catch (error) {
            // console.log("error is: ",error)
            window.alert('Error')
            setLoading(false)
          }
        }
        callMethod();
      setLoading(false)
  }

  return (
    <>
      <div>
        <Navbar account={account} />
        {loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
            filesCount={filesCount}
            files={files}
            captureFile={captureFile}
            uploadFile={uploadFile}
          />
        }
      </div></>
  )
}

export default App