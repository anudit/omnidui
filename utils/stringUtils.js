import { getAddress } from "ethers/lib/utils";

export const fromB64 = (b64) => {

    if (Boolean(b64) == false){
        return "";
    }
    else {
        let buff = new Buffer.from(b64, 'base64');
        let text = buff.toString('ascii');
        return text;
    }
};

export const toB64 = (url) => {
    if (Boolean(url) == false){
        return "";
    }
    else {
        let buff = new Buffer.from(url, 'ascii');
        let text = buff.toString('base64');
        return text;
    }
};


export const cleanAdd = (message) => {

    let regex = /(@0x[a-fA-F0-9]{40})/g;
    let m;
    let result = [];
    while ((m = regex.exec(message)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        result.push(m[0]);
    }
    for (var i = 0; i < result.length; i++) {
        message  = message.replace(result[i],truncateAddress(result[i]))
    }
    return message;
};

export const truncateAddress = (address, len=4) => {
    return address?.slice(0, 2+len) + "..." + address?.slice(-len);
};


const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const randomId = (length = 20) => {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export const prettyTime = (timestamp) => {

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dt = new Date(parseInt(timestamp));
    const ampm = dt.getHours() <= 12 ? "AM" : "PM"
    const h = dt.getHours() <= 12 ? dt.getHours() : dt.getHours()-12;
    const m = dt.getMinutes().toString().padStart(2,'0');
    const d = dt.getDate();
    const month = monthNames[dt.getMonth()];
    const y = dt.getFullYear();
    return `${h}:${m} ${ampm} •  ${month} ${d}, ${y}`;

}

export const prettifyNumber = (num, digits=2) => {
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}



export async function addressToEns(address){

    let data = await fetch("https://api.thegraph.com/subgraphs/name/ensdomains/ens", {
        "headers": {
            "accept": "*/*",
            "content-type": "application/json",
        },
        "referrer": "https://thegraph.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{\"query\":\"{\\sn  domains (where: {resolvedAddress: \\\""+address.toLowerCase()+"\\\"}){\\n    name\\n  }\\n}\\n\",\"variables\":null}",
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
    });

    let resp = await data.json();
    if (resp['data']['domains'].length === 0){
        return false;
    }
    else {
        let finalDomain = false;
        for (let index = 0; index < resp['data']['domains'].length; index++) {
            const domain = resp['data']['domains'][index];
            if (domain.name.split('.').length == 2){
                finalDomain = domain.name;
            }
        }
        return finalDomain;
    }

}

export async function ensToAddress(ensAddress){
    try {

        let resp = await fetch("https://api.thegraph.com/subgraphs/name/ensdomains/ens", {
            "headers": {
                "accept": "*/*",
                "content-type": "application/json",
            },
            "body": "{\"query\":\"{\\n  domains(where:{name:\\\""+ensAddress+"\\\"}) {\\n    resolvedAddress {\\n      id\\n    }\\n  }\\n}\\n\",\"variables\":null}",
            "method": "POST",
        }).then((r)=>{return r.json()});

        if (Boolean(resp['data']["domains"][0]["resolvedAddress"]) === false){
            return false;
        }
        else {
            return getAddress(resp['data']["domains"][0]["resolvedAddress"]['id'])
        }

    } catch (error) {
        return false;
    }
}
