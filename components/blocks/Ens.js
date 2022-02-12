import React, { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { truncateAddress } from "@/utils/stringUtils";

export default function Ens() {

  const router = useRouter();
  const [ensData, setEnsData] = useState({
    name: null,
    profileUrl: null,
  });

  useEffect(()=>{

    async function getEnsData() {

      let tp = new ethers.providers.AlchemyProvider("mainnet","aCCNMibQ1zmvthnsyWUWFkm_UAvGtZdv");
      let ensName = await tp.lookupAddress(router?.query?.address);

      let profileData = {
        name: null,
        profileUrl: null,
      };

      if (Boolean(ensName) === true){
        profileData['name'] = ensName;
        profileData['profileUrl'] = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;
      }

      console.log(profileData);

      setEnsData(profileData)
    }
    getEnsData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // router?.query?.address
  return(
    <>
      <Flex direction="row" w="100%" justifyContent="center" my={1}>
        <Text fontSize="large" fontWeight="600">{ensData?.name === null ? truncateAddress(router?.query?.address) : ensData.name}</Text>
      </Flex>
      <Flex direction="row" w="100%" h="100%" backgroundImage={Boolean(ensData?.profileUrl) && ensData.profileUrl} />
    </>
  );
}
