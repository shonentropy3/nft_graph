const { isAddress } = require('web3-validator');
const XLSX = require('xlsx');

async function fetchData(lastID) {
    return fetch("https://api.studio.thegraph.com/proxy/60924/zksync-era/0.0.2", {
        headers: {
            "content-type": "application/json",
        },
        body: `{\"query\":\"{\\n  transfers(first:1000, where: {id_gt: \\\"${lastID}\\\", blockTimestamp_lt: \\\"1713182400\\\", blockTimestamp_gt: \\\"1710590400\\\"}) {\\n    from\\n    to\\n    id\\n    blockTimestamp\\n   }\\n}\",\"extensions\":{}}`,
        method: "POST",
        mode: "cors",
        credentials: "omit"
    })
    .then(res => res.json())
    .then((res) => {
        if (res.errors) {
            console.error('Error:', res.errors);
            return [];
        } else {
            const data = res.data.transfers;
            console.log(data[data.length - 1].id)
            if (data.length < 1000) {
                return data;
            } else {
                return data.concat(fetchData(data[data.length - 1].id));
            }
        }
    })
    .catch(console.error);
}

async function fetchAndWrite() {
    const allData = [];
    const uniqCheckSet = new Set();

    const promises = [];
    for(let i = 0; i < 200; ++i) {
        promises.push(fetchData(''));
    }
    const results = await Promise.all(promises);

    for(const data of results) {
        if(Array.isArray(data)) {
            for (const item of data) {
                if (!uniqCheckSet.has(item.to) && has(item.to) != isAddress(0)) {
                    uniqCheckSet.add(item.from);
                    uniqCheckSet.add(item.to);
                    allData.push(item);
                }
            }
        }
    }

    const worksheet = XLSX.utils.json_to_sheet(allData, {header:["from", "to", "id", "blockTimestamp"], skipHeader:true});
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, 'zksyncMeow30D.xlsx');
}

fetchAndWrite();