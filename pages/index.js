import React, { useRef, useContext } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Flex, Input, InputGroup, InputLeftElement, InputRightElement, Tooltip } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { OmnidIcon, WalletIcon } from "@/public/icons";
import NavBar from "@/components/Navbar";
import { Web3Context } from "@/contexts/Web3Context";
import { isAddress } from "ethers/lib/utils";
import { ethers } from "ethers";
import { ensToAddress } from "@/utils/stringUtils";

export default function Home() {

  const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
    return [ htmlElRef, setFocus ]
  }

  const router = useRouter();
  const web3Context = useContext(Web3Context);
  const { connectWallet } = web3Context;
  const [searchBox, setInputFocus] = useFocus();

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      const val = searchBox.current.value;
      if (isAddress(val) === true) router.push(`/${val}`)
      else if (String(val).endsWith('.eth') === true) {
        let ensAddress = await ensToAddress(val);
        if (isAddress(ensAddress) === true) router.push(`/${ensAddress}`)
        else alert('Invalid')
      }
    }
  }

  async function populateAddress(){
    let add = await connectWallet();
    console.log(add);
    searchBox.current.value = add;
    setInputFocus();
  }

  return (
    <>
        <Head>
            <title>Omnid</title>
            <meta name="description" content="Omnid" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Flex direction="column" p="200px" alignItems="center" h="100vh">
          <Flex direction="column" justifyContent="center" alignItems="center" w={{base:"100vw", md:"50vw"}}>
            <OmnidIcon boxSize={32} />
            <br/><br/>
            <InputGroup>
              <InputLeftElement pointerEvents="none" mr={2}>
                <SearchIcon color="gray.300" mt="12px" ml="20px"/>
              </InputLeftElement>
              <Input
                ref={searchBox}
                autoFocus
                type="text"
                onKeyDown={handleKeyDown}
                placeholder="Search Omnid"
                defaultValue="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                py="25px"
                pl="50px"
                borderRadius="100px"
              />
              <InputRightElement ml={2}>
                <Tooltip hasArrow label='Use from Wallet'  placement='left'>
                  <WalletIcon color="gray.300" mt="12px" mr="20px" onClick={populateAddress} cursor="pointer"/>
                </Tooltip>
              </InputRightElement>
            </InputGroup>

          </Flex>
        </Flex>
    </>
  )
}
