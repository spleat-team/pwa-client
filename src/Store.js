import React from 'react';
import ReceiptLifecycle from './ReceiptLifecycle';

export const Store = React.createContext();

const receiptInfoInitialState = {
  doesLoadedImage: false,
  hasReceiptInPhoto: false,
  receiptCoordinates: [],
  receiptEdges: '',
  receiptItems: '',
  receiptNumOfPeople: '',
  preMessage: 'סה"כ 2 שלבים פשוטים וסיימתם!',
  errorMessage: '',
  photo: null,
};

const initialState = {
  loading: false,
  user: '',
  userLoggedIn: false,
  src: null,
  crop: {
    width: 200,
    x: 0,
    y: 0,
  },
  status: ReceiptLifecycle.NO_FILE,
  sharersCount: 0,
  finishedCount: 0,
  tip: 10,
  checkedItems: [],
  paymentPerUser: [],
  ...receiptInfoInitialState,
};

function reducer(state, action) {
  console.log("reducer got : ", action.type);
  switch (action.type) {
    case 'TOGGLE_LOADING':
      return {
        ...state,
        loading: !state.loading,
        loadingMessage: action.payload,
      };
    case ReceiptLifecycle.NO_FILE:
      return {
        ...state,
        status: ReceiptLifecycle.NO_FILE,
        ...receiptInfoInitialState,
        errorMessage: '',
        preMessage: 'סה"כ 2 שלבים פשוטים וסיימתם!',
      };
    case ReceiptLifecycle.FILE_CHOOSED:
      return {
        ...state,
        status: ReceiptLifecycle.FILE_CHOOSED,
        doesLoadedImage: true,
        photo: action.payload,
        errorMessage: '',
        preMessage: 'מאמת את הקבלה...',
        postMessage: '',
      };
    case ReceiptLifecycle.FILE_LOADED:
      return {
        ...state,
        status: ReceiptLifecycle.FILE_LOADED,
        doesLoadedImage: true,
        src: action.payload,
        errorMessage: '',
      };
    case ReceiptLifecycle.CHECK_RECEIPT: {
      return {
        ...state,
        status: ReceiptLifecycle.CHECK_RECEIPT,
        cropperMessage: 'בודק אם יש קבלה בתמונה..',
      };
    }
    case ReceiptLifecycle.RECEIPT_CHECKED: {
      let errorMessage =
        action.payload === 1
          ? ''
          : 'לא מצאנו קבלה בתמונה, נסו להעלות תמונה טובה יותר או להתמקד על אזור המנות בקבלה בבקשה';
      return {
        ...state,
        status: ReceiptLifecycle.RECEIPT_CHECKED,
        hasReceiptInPhoto: action.payload,
        errorMessage: errorMessage,
        cropperMessage: '',
      };
    }
    case ReceiptLifecycle.FIND_EDGES:
      return {
        ...state,
        status: ReceiptLifecycle.FIND_EDGES,
        cropperMessage: 'מחפש את הקבלה בתמונה..',
        errorMessage: '',
      };
    case ReceiptLifecycle.EDGES_FOUND:
      return {
        ...state,
        status: ReceiptLifecycle.EDGES_FOUND,
        crop: action.payload,
        errorMessage: '',
        cropperMessage:
          'כדי לעזור לנו למצוא טוב יותר את המנות, שפרו את סימון הקבלה',
      };
    case ReceiptLifecycle.EXTRACT_ITEMS:
      return {
        ...state,
        status: ReceiptLifecycle.EXTRACT_ITEMS,
      };
    case ReceiptLifecycle.RECEIPT_ITEMS_EXTRACTED:
      return {
        ...state,
        status: ReceiptLifecycle.RECEIPT_ITEMS_EXTRACTED,
        receiptItems: action.payload,
        errorMessage: !action.payload
          ? '...מתנצלים, לא הצלחנו למצוא פריטים בקבלה'
          : '',
      };
    case 'NEW_CROP':
      return { ...state, crop: action.payload };
    case 'SET_NUM_OF_PEOPLE':
      return { ...state, receiptNumOfPeople: action.payload };
    case 'USER_LOGIN':
      return { ...state, userLoggedIn: true, user: action.payload };
    case 'USER_LOGOUT':
      return { ...state, userLoggedIn: false, user: null };
    case 'SHARERS_COUNT':
      return { ...state, sharersCount: action.sharersCount };
    case 'SET_PINCODE':
      return { ...state, pincode: action.payload };
    //todo: think if it's necessary
    case 'FINISHED_SELECT_ITEMS':
      return { ...state, finishedCount: action.finishedCount };
    case 'CHECKED_ITEMS':
      return { ...state, checkedItems: action.checkedItems };
    case 'FINISHED_CALC':
      return { ...state, paymentPerUser: action.paymentPerUser };
    case 'TIP_SELECTED':
      return { ...state, tip: action.tip };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
