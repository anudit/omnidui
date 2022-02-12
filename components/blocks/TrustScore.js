import React, { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Convo } from "@theconvospace/sdk";
import { isAddress } from "ethers/lib/utils";


export default function TrustScoreBlock() {

    const router = useRouter();
    const [scoreData, setScoreData] = useState(null);
    const convo = new Convo('CSCpPwHnkB3niBJiUjy92YGP6xVkVZbWfK8xriDO');

    useEffect(()=>{
      if (isAddress(router?.query?.address) === true){
        convo.omnid.getTrustScore(router.query.address).then(setScoreData);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])

    return(
      <>
        <Text fontSize="xx-large" fontWeight="600">TrustScore</Text>
        {
          Boolean(scoreData) === true? (
            <Text fontSize="100px" fontWeight="100">{scoreData?.score}</Text>
          ) : (
            <Text fontSize="100px" fontWeight="100">...</Text>
          )
        }
      </>
    );
}
