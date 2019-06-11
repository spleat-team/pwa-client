import React from 'react';
import ReceiptLifecycle from './ReceiptLifecycle';

export const Store = React.createContext();

const receiptFlowInitialState = {
  doesLoadedImage: false,
  hasReceiptInPhoto: false,
  receiptCoordinates: [],
  receiptEdges: '',
  receiptItems: '',
  receiptNumOfPeople: '',
  preMessage: 'סה"כ 2 שלבים פשוטים וסיימתם!',
  photo: null,
  croppedPhoto: null,
  src: null,
  mlProposedCrop: {},
  userEndedCropping: false,
  actualCrop: {},
  status: ReceiptLifecycle.NO_FILE,
  sharersCount: 0,
};

const paymentInitialState = {
  finishedCount: 0,
  checkedItems: [],
  paymentPerUser: [],
  pincode: '',
  tip: 10,
};

const initialState = {
  ...receiptFlowInitialState,
  ...paymentInitialState,
  loading: false,
  user: '',
  userLoggedIn: false,
  errorMessage: '',
};

function reducer(state, action) {
  console.log('reducer got : ', action.type, action);
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
        ...receiptFlowInitialState,
        errorMessage: '',
        preMessage: 'סה"כ 2 שלבים פשוטים וסיימתם!',
      };
    case ReceiptLifecycle.FILE_CHOOSED:
      return {
        ...state,
        status: ReceiptLifecycle.FILE_CHOOSED,
        doesLoadedImage: true,
        photo: action.photo,
        errorMessage: '',
        preMessage: 'מאמת את הקבלה...',
        postMessage: '',
      };
    case ReceiptLifecycle.FILE_LOADED:
      return {
        ...state,
        status: ReceiptLifecycle.FILE_LOADED,
        doesLoadedImage: true,
        src: action.src,
        errorMessage: '',
      };
    case ReceiptLifecycle.CHECK_RECEIPT: {
      return {
        ...state,
        status: ReceiptLifecycle.CHECK_RECEIPT,
        loading: true,
        loadingMessage: 'בודק אם יש קבלה בתמונה..',
      };
    }
    case ReceiptLifecycle.RECEIPT_CHECKED: {
      let errorMessage =
        action.payload != 1 &&
        (action.payload === 0
          ? 'לא מצאנו קבלה בתמונה, נסו להעלות תמונה טובה יותר או להתמקד על אזור המנות בקבלה בבקשה'
          : 'לא הצלחנו לשלוח את הקבלה לשרת, נסה שוב בבקשה');
      return {
        ...state,
        status: ReceiptLifecycle.RECEIPT_CHECKED,
        hasReceiptInPhoto: action.payload,
        errorMessage: errorMessage,
        loading: false,
        loadingMessage: '',
      };
    }
    case ReceiptLifecycle.FIND_EDGES:
      return {
        ...state,
        status: ReceiptLifecycle.FIND_EDGES,
        loading: true,
        loadingMessage: 'מחפש את הקבלה בתמונה..',
        errorMessage: '',
      };
    case ReceiptLifecycle.EDGES_FOUND:
      return {
        ...state,
        status: ReceiptLifecycle.EDGES_FOUND,
        mlProposedCrop: action.payload,
        userEndedCropping: false, // TO ENSURE THAT THE USER VERIFIED THE NEW PROPOSED CROP
        errorMessage: '',
        loading: false,
        cropperMessage:
          'כדי לעזור לנו למצוא טוב יותר את המנות, שפרו את סימון הקבלה',
      };
    case ReceiptLifecycle.EXTRACT_ITEMS:
      return {
        ...state,
        status: ReceiptLifecycle.EXTRACT_ITEMS,
        loading: false,
      };
    case ReceiptLifecycle.RECEIPT_ITEMS_EXTRACTED:
      return {
        ...state,
        status: ReceiptLifecycle.RECEIPT_ITEMS_EXTRACTED,
        receiptItems: action.payload,
        errorMessage:
          !action.payload || action.payload == ''
            ? '...מתנצלים, לא הצלחנו למצוא פריטים בקבלה'
            : '',
        loading: false,
      };
    // case 'NEW_CROP_SHAPE':
    //   return { ...state, cropImageShape: action.payload };
    case 'USER_UNDO_CROP':
      return {
        ...state,
        userEndedCropping: false,
      };
    case 'NEW_CROP':
      return {
        ...state,
        actualCrop: action.actualCrop,
        userEndedCropping: true,
        // croppedPhoto: action.croppedPhoto,
        relativeCropDiff: action.diff,
      };
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
    case 'STOP_LOADING':
      return { ...state, loading: false, errorMessage: '' };
    case 'SET_LOADING_MESSAGE':
      return { ...state, loading: true, loadingMessage: action.message };
    case 'SET_ERROR_MESSAGE':
      return { ...state, errorMessage: action.message };
    case 'RESET_FOR_NEW_SCAN':
      return { ...state, ...receiptFlowInitialState, ...paymentInitialState };
    default: {
      console.log('WTF? Default case achieved in the store..');
      return state;
    }
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
