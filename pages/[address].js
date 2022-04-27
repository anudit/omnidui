import React, { useState } from 'react';
import { Flex, FormControl, FormLabel, Switch, Text } from '@chakra-ui/react';
import { Convo } from '@theconvospace/sdk';
import { getAddress, isAddress } from 'ethers/lib/utils';
import { ensToAddress } from '@/utils/stringUtils';

const { ETHERSCAN_API_KEY, CNVSEC_ID, POLYGONSCAN_API_KEY } = process.env;

export async function getServerSideProps(context) {

    const config = {
        polygonMainnetRpc: "https://polygon-rpc.com/",
        etherumMainnetRpc: "https://mainnet.infura.io/v3/1e7969225b2f4eefb3ae792aabf1cc17",
        avalancheMainnetRpc: "https://avalanche--mainnet--rpc.datahub.figment.io/apikey/21681330d5fd73930f5600c7c4f0feeb/ext/bc/C/rpc",
        maticPriceInUsd: 1.4,
        etherumPriceInUsd: 3200,
        etherscanApiKey: ETHERSCAN_API_KEY,
        polygonscanApiKey: POLYGONSCAN_API_KEY,
        CNVSEC_ID: CNVSEC_ID,
        DEBUG: false,
    };

    const convo = new Convo('CSCpPwHnkB3niBJiUjy92YGP6xVkVZbWfK8xriDO');
    let address = false;

    if (isAddress(context.query.address)){
        address = getAddress(context.query.address);
    }
    else if (context.query.address.endsWith('.eth')){
        const ensResp = await ensToAddress(context.query.address);
        if (Boolean(ensResp) == true) address = ensResp;
    }

    if (Boolean(address) === true){

        let resp = await convo.omnid.computeTrustScore(address, config);

        resp = JSON.parse(JSON.stringify(resp), (key, value) => {
            if (value == null)
                return undefined;
            return value;
        });

        return {
          props: { address: address, omnidData: resp },
        }
    }
    else {
        return {
            props: { address: context.query.address, omnidData: false },
        }
    }
}

const Page = (props) => {
    if (Boolean(props.omnidData) === true){
        return (
            <Text fontSize="x-large" fontWeight="800">
                { props.address }
            </Text>
        )
    }
    else {
        return (
            <Text fontSize="x-large" fontWeight="800">
                { props.address } is an Invalid Address.
            </Text>
        )
    }
}

export default Page;
