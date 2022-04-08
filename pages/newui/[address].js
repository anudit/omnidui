import React, { useState } from 'react';
import { Flex, FormControl, FormLabel, Switch } from '@chakra-ui/react';
import GridLayout from "react-grid-layout";
import dynamic from 'next/dynamic'

const DiscordBlock = dynamic(() => import('../../components/blocks/Discord'))
const TrustScoreBlock = dynamic(() => import('../../components/blocks/TrustScore'))
const YoutubeBlock = dynamic(() => import('../../components/blocks/Youtube'))
const EnsBlock = dynamic(() => import('../../components/blocks/Ens'))
const AppleBlock = dynamic(() => import('../../components/blocks/Minimalist'))

const IdentitySection = () => {

    const blocksToApp = {
      "ens": {
        "customProps": {
          backgroundColor: "#274192",
          p: 0
        },
        "component" : <EnsBlock />
      },
      "trustscore": {
        "customProps": {
          backgroundColor: "#159947",
        },
        "component" : <TrustScoreBlock />
      },
      "video": {
        "customProps": {
          backgroundColor: "#C1000F",
          p: 0
        },
        "component" : <YoutubeBlock />
      },
      "discord": {
        "customProps": {
          backgroundColor: "#f0f",
        },
        "component" : <DiscordBlock />
      },
      "apple": {
        "customProps": {
          backgroundColor: "#000",
          borderWidth: "1px",
          borderColor: "#ffffffb8",
          boxShadow: "0 0 17px #000, 0 0 9px #ffffff",
        },
        "component" : <AppleBlock />
      }
    };

    const [layout, setLayout] = useState([
      { i: "ens", x: 0, y: 0, w: 2, h: 8 },
      { i: "trustscore", x: 2, y: 5, w: 3, h: 5, minW: 3, maxW: 3 },
      { i: "video", x: 2, y: 0, w: 3, h: 5, minW: 2, minH: 5 },
      { i: "discord", x: 5, y: 0, w: 3, h: 5, minW: 2, minH: 5 },
      { i: "apple", x: 7, y: 0, w: 3, h: 5, minW: 2, minH: 4 }
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

// const BlankBlock = () => {
//   return (
//     <Text fontSize="x-large" fontWeight="800">
//         hi
//     </Text>
//   )
// }
