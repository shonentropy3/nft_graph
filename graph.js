// import {fetch} from 'node-fetch';
const { utils, writeFile } = require('xlsx');
// const XLSX = require('xlsx');
fetch("https://api.studio.thegraph.com/query/60924/base/0.0.1", {
    headers: {
        "content-type": "application/json",
    },
    body: "{\"query\":\"{\\n  transfers(first:1000, where: {name: \\\"degen\\\"}) {\\n    from\\n    to\\n    blockTimestamp\\n   }\\n}\",\"extensions\":{}}",
    method: "POST",
    mode: "cors",
    credentials: "omit"
}).then(res => res.json())
.then((res) => {
    const data = res.data.transfers;
    const uniqCheckSet = new Set();
    const uniqueData = [];
    const uniqCheckTransferSet = new Set();
    for (const item of data) {
        // 使用 "from:to" 的形式来创建唯一的标识符
        // const idCombo = item.from + ':' + item.to;
        if (!uniqCheckSet.has(item.from) ) {
                uniqCheckSet.add(item.from);
                // uniqCheckSet.add(item.to);
                if(!uniqCheckTransferSet.has(item.id)){
                    uniqCheckTransferSet.add(item.id);
                    uniqueData.push(item);
                }
        }
        if(!uniqCheckSet.has(item.to)) {
            uniqCheckSet.add(item.to);
            if(!uniqCheckTransferSet.has(item.id)){
                uniqCheckTransferSet.add(item.id);
                uniqueData.push(item);
            }
        }
    }
    const worksheet = utils.json_to_sheet(uniqueData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet);
    writeFile(workbook, 'out.xlsx');
})
.catch(console.error);