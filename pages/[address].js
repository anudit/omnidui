import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Flex, FormControl, FormLabel, Switch, Text } from '@chakra-ui/react';
import GridLayout from "react-grid-layout";

const IdentitySection = () => {

    const router = useRouter();
    const [layout, setLayout] = useState([
      { i: "a", x: 0, y: 0, w: 2, h: 5 },
      { i: "b", x: 2, y: 5, w: 3, h: 2, minW: 3, maxW: 3 },
      { i: "c", x: 2, y: 0, w: 3, h: 5, minW: 2, minH: 5 }
    ]);

    return (
      <>
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='email-alerts' mb='0'>
            Lock Gird?
          </FormLabel>
          <Switch id='email-alerts' onChange={(event)=>{
            let newLayout = layout;
            newLayout[0]['static'] = event.target.checked;
            newLayout[1]['static'] = event.target.checked;
            newLayout[2]['static'] = event.target.checked;
            console.log('newLayout', newLayout, event.target.checked)
            setLayout(newLayout);
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
        >
          <Flex key="a" backgroundColor="#346B6D" borderRadius="10px" p={2} color="#000" justifyContent="space-between" flexDirection="column">
            <Text fontSize="x-large" fontWeight="800">Your Address</Text>
            <Text fontSize="30px" fontWeight="100">{router?.query?.address}</Text>
          </Flex>
          <Flex key="b" backgroundColor="#2A445E" borderRadius="10px" p={2} color="#000">
            <Text fontSize="x-large" fontWeight="800">Blue</Text>
          </Flex>
          <Flex key="c" backgroundColor="#F3AA20" borderRadius="10px" p={2} color="#000" justifyContent="space-between" flexDirection="column">
            <Text fontSize="x-large" fontWeight="800">TrustScore</Text>
            <Text fontSize="100px" fontWeight="900">86</Text>
          </Flex>
        </GridLayout>
      </>
    )

}

export default IdentitySection;
