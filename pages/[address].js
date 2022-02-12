import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Flex, FormControl, FormLabel, Switch, Text } from '@chakra-ui/react';
import GridLayout from "react-grid-layout";
import { Convo } from '@theconvospace/sdk';
import { isAddress } from 'ethers/lib/utils';
import { DiscordIcon, YoutubeIcon } from '@/public/icons';

const IdentitySection = () => {

    const blocksToApp = {
      "address": {
        "customProps": {
          backgroundColor: "#346B6D",
        },
        "component" : <AddressBlock />
      },
      "trustscore": {
        "customProps": {
          backgroundColor: "#274192",
        },
        "component" : <TrustScoreBlock />
      },
      "video": {
        "customProps": {
          backgroundColor: "#C1000F",
          p: 0
        },
        "component" : <VideoBlock />
      },
      "discord": {
        "customProps": {
          backgroundColor: "#f0f",
        },
        "component" : <DiscordBlock />
      }
    };

    const [layout, setLayout] = useState([
      { i: "address", x: 0, y: 0, w: 2, h: 8 },
      { i: "trustscore", x: 2, y: 5, w: 3, h: 5, minW: 3, maxW: 3 },
      { i: "video", x: 2, y: 0, w: 3, h: 5, minW: 2, minH: 5 },
      { i: "discord", x: 5, y: 0, w: 3, h: 5, minW: 2, minH: 5 }
    ]);

    const [locked, setLocked] = useState(false);

    return (
      <>
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='email-alerts' mb='0'>
            Lock Grid?
          </FormLabel>
          <Switch id='email-alerts' onChange={(event)=>{
            setLocked(event.target.checked);
          }}/>
        </FormControl>
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1200}
          onLayoutChange={(layout) => {
            console.log(layout)
            setLayout(layout)
          }}
          isDraggable={!locked}
        >
          {
            layout && layout.map((lay)=>{
              return (
                <Flex key={lay.i} p={2} borderRadius="10px" color="#000" justifyContent="space-between" flexDirection="column" {...blocksToApp[lay.i].customProps}>
                  { blocksToApp[lay.i]?.component }
                </Flex>
              )
            })
          }
        </GridLayout>
      </>
    )
}
export default IdentitySection;

const AddressBlock = () => {

  const router = useRouter();

  return(
    <>
      <Text fontSize="x-large" fontWeight="500">Your Address</Text>
      <Text fontSize="30px" fontWeight="100">{router?.query?.address}</Text>
    </>
  );
}

const TrustScoreBlock = () => {

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

const DiscordBlock = () => {

  return(
    <>
      <Flex direction="row">
        <DiscordIcon mr={2} width={6} height={6} />
        <Text fontSize="large" fontWeight="600">Discord</Text>
      </Flex>
      <Text fontSize="30px" fontWeight="100">Anudit#0000</Text>
    </>
  );
}

const VideoBlock = () => {
  return(
    <>
      <Flex direction="row" w="100%" justifyContent="center" my={1}>
        <YoutubeIcon mr={2} width={6} height={6} />
        <Text fontSize="large" fontWeight="600">Youtube</Text>
      </Flex>
      <iframe width="inherit" height="100%" src="https://www.youtube.com/embed/QH2-TGUlwu4" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    </>
  );
}

// const BlankBlock = () => {
//   return (
//     <Text fontSize="x-large" fontWeight="800">
//         hi
//     </Text>
//   )
// }
