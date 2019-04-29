const SERVER_URL = 'http://193.106.55.179:8888/';
// export default {
//     0: {name: 'CHECK_RECEIPT', url:`${SERVER_URL}isReceipt`},
//     1: {name: 'FIND_EDGES', url:`${SERVER_URL}detectReceipt`},
//     2: {name: 'EXTRACT_ITEMS', url:`${SERVER_URL}extractReceiptItems`},
// }

export default {
    NO_FILE: 'NO_FILE',
    FILE_CHOOSED: 'FILE_CHOOSED',
    FILE_LOADED: {souldStartFlow: true},
    CHECK_RECEIPT: {id:0, url: `${SERVER_URL}isReceipt`},
    FIND_EDGES: {id: 1, url: `${SERVER_URL}detectReceipt`},
    EXTRACT_ITEMS: {id: 2, url: `${SERVER_URL}extractReceiptItems`},
}