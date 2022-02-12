import { checkPoH, getMirrorData, checkUnstoppableDomains, getEthPrice, getFoundationData, getRaribleData, getSuperrareData, getKnownOriginData, getAsyncartData } from "@/lib/identity";
import { ethers } from "ethers";
import { isAddress } from 'ethers/lib/utils';
import fetcher from '@/utils/fetcher';

async function calculateScore(address) {
    let tp = new ethers.providers.AlchemyProvider("mainnet","hHgRhUVdMTMcG3_gezsZSGAi_HoK43cA");

    let promiseArray = [
        checkPoH(address, tp),
        fetcher(`https://app.brightid.org/node/v5/verifications/Convo/${address.toLowerCase()}`, "GET", {}),
        fetcher(`https://api.poap.xyz/actions/scan/${address}`, "GET", {}),
        tp.lookupAddress(address),
        fetcher(`https://api.idena.io/api/Address/${address}`, "GET", {}),
    ];

    let results1 = await Promise.allSettled(promiseArray);

    let promiseArray2 = [
        fetcher(`https://api.cryptoscamdb.org/v1/check/${address}`, "GET", {}),
        checkUnstoppableDomains(address),
        fetcher(`https://raw.githubusercontent.com/Uniswap/sybil-list/master/verified.json`, "GET", {}),
        fetcher(`https://backend.deepdao.io/user/${address.toLowerCase()}`, "GET", {}),
        fetcher(`https://0pdqa8vvt6.execute-api.us-east-1.amazonaws.com/app/task_progress?address=${address}`, "GET", {}),
    ];

    let results2 = await Promise.allSettled(promiseArray2);

    let promiseArray3 = [
        getEthPrice(),
        getFoundationData(address), // * ethPrice
        getSuperrareData(address),
        getRaribleData(address), // * ethPrice
        getKnownOriginData(address), // * ethPrice
        getAsyncartData(address), // * ethPrice
        getMirrorData(address),
        fetcher(`https://stg-api.unmarshal.io/v1/bsc/address/${address}/nft-assets?auth_key=VGVtcEtleQ==`, "GET", {}),
    ];

    let results3 = await Promise.allSettled(promiseArray3);

    let results = results1.concat(results2);
    results = results.concat(results3);

    let score = 0;
    let retData = {
        'success': true,
        'unmarshal': Boolean(results[17].value?.length)=== true ? results[17].value?.length : 0,
        'poh': results[0].value,
        'brightId': Boolean(results[1].value?.data?.unique),
        'poap': results[2].value?.length,
        'ens': Boolean(results[3].value),
        'idena': Boolean(results[4].value?.result),
        'cryptoScamDb': Boolean(results[5].value?.success),
        'unstoppableDomains': Boolean(results[6].value),
        'uniswapSybil': Object.keys(results[7].value).includes(address),
        'deepdao': Boolean(results[8].value?.totalDaos) === true? parseInt(results[8].value?.totalDaos) : 0,
        'rabbitHole': parseInt(results[9].value?.taskData?.level) - 1,
        'mirror': results[16].value,
        'foundation': {
            'totalCountSold': results[11]?.value?.totalCountSold,
            'totalAmountSold': results[11]?.value?.totalAmountSold * results[10]?.value
        },
        'superrare': {
            'totalCountSold': results[12]?.value?.totalCountSold,
            'totalAmountSold': results[12]?.value?.totalAmountSold
        },
        'rarible': {
            'totalCountSold': results[13]?.value?.totalCountSold,
            'totalAmountSold': results[13]?.value?.totalAmountSold * results[10]?.value
        },
        'knownorigin': {
            'totalCountSold': results[14]?.value?.totalCountSold,
            'totalAmountSold': results[14]?.value?.totalAmountSold * results[10]?.value
        },
        'asyncart': {
            'totalCountSold': results[15]?.value?.totalCountSold,
            'totalAmountSold': results[15]?.value?.totalAmountSold * results[10]?.value
        }
    };

    if(results[0].value === true){ // poh
        score += 8;
    }
    if(Boolean(results[1].value.data?.unique) === true){ // brightid
        score += 37;
    }
    if(Boolean(results[2].value) === true){ // poap
        score += results[2].value.length;
    }
    if(Boolean(results[3].value) === true){ // ens
        score += 12;
    }
    if(Boolean(results[4].value?.result) === true){ // idena
        score += 1;
    }
    if(Boolean(results[5].value?.success) === true){ // cryptoscamdb
        score -= 20;
    }
    if(Boolean(results[6].value) === true){ // unstoppable domains
        score += 1;
    }
    if(results[7].value.length > 0){ // uniswap sybil
        score += 10;
    }
    if(parseInt(results[8].value?.totalDaos)> 0){ // deepdao
        score += parseInt(results[8].value?.totalDaos);
    }
    if(parseInt(results[9].value?.taskData?.level)> 0){ // rabbithole
        score += parseInt(results[9].value?.taskData?.level);
    }
    if(results[16].value === true){ // mirror
        score += 10;
    }

    return {score, ...retData};
}

export default async (req, res) => {

    try {

        if (Object.keys(req.query).includes('address') === true && isAddress(req.query.address) === true ){

            let scoreData = await calculateScore(req.query.address);
            res.status(200).json(scoreData);

        }
        else {
            res.status(401).json({
                'success': false,
                'error': 'Invalid Address.'
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ 'success': false, error });
    }
}
