const SERVER_URL = 'http://193.106.55.179:8888/';
// export default {
//     0: {name: 'CHECK_RECEIPT', url:`${SERVER_URL}isReceipt`},
//     1: {name: 'FIND_EDGES', url:`${SERVER_URL}detectReceipt`},
//     2: {name: 'EXTRACT_ITEMS', url:`${SERVER_URL}extractReceiptItems`},
// }

export default {
  NO_FILE: { type: 'NO_FILE' },
  FILE_CHOOSED: { type: 'FILE_CHOOSED' },
  FILE_LOADED: { type: 'FILE_LOADED', souldStartFlow: true },
  CHECK_RECEIPT: { type: 'CHECK_RECEIPT', url: `${SERVER_URL}isReceipt` },
  RECEIPT_CHECKED: { type: 'RECEIPT_CHECKED' },
  FIND_EDGES: { type: 'FIND_EDGES', url: `${SERVER_URL}detectReceipt` },
  EDGES_FOUND: { type: 'EDGES_FOUND' },
  EXTRACT_ITEMS: {
    type: 'EXTRACT_ITEMS',
    url: `${SERVER_URL}extractReceiptItems`,
  },
  RECEIPT_ITEMS_EXTRACTED: { type: 'RECEIPT_ITEMS_EXTRACTED' },
};
