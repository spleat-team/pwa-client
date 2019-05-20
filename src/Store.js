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
  checkedItems: [],
  paymentPerUser: [],
  ...receiptInfoInitialState,
};

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_LOADING':
      return { ...state, loading: !state.loading };
    case ReceiptLifecycle.NO_FILE:
      return {
        ...state,
        status: ReceiptLifecycle.NO_FILE,
        loading: false,
        ...receiptInfoInitialState,
        errorMessage: '',
        preMessage: 'סה"כ 2 שלבים פשוטים וסיימתם!',
      };
    case ReceiptLifecycle.FILE_CHOOSED:
      return {
        ...state,
        status: ReceiptLifecycle.FILE_CHOOSED,
        loading: false,
        doesLoadedImage: false,
        photo: action.payload,
        errorMessage: '',
        preMessage: 'מאמת את הקבלה...',
      };
    case ReceiptLifecycle.FILE_LOADED:
      return {
        ...state,
        status: ReceiptLifecycle.FILE_LOADED,
        loading: false,
        doesLoadedImage: true,
        src: action.payload,
        errorMessage: '',
      };
    case ReceiptLifecycle.CHECK_RECEIPT:
      let errorMessage = !action.payload
        ? 'לא מצאנו קבלה בתמונה, נסו להעלות תמונה טובה יותר בבקשה'
        : 'אופס, משהו השתבש.. נסו להעלות את הקבלה מחדש בבקשה';
      return {
        ...state,
        status: ReceiptLifecycle.CHECK_RECEIPT,
        loading: false,
        hasReceiptInPhoto: action.payload,
        errorMessage: errorMessage,
      };
    case ReceiptLifecycle.FIND_EDGES:
      return {
        ...state,
        status: ReceiptLifecycle.FIND_EDGES,
        loading: false,
        receiptEdges: action.payload,
        errorMessage: '',
        preMessage: 'מנתח את הקבלה...',
      };
    case ReceiptLifecycle.EXTRACT_ITEMS:
      return {
        ...state,
        status: ReceiptLifecycle.EXTRACT_ITEMS,
        loading: false,
        receiptItems: action.payload,
        errorMessage: '',
        preMessage: 'כדי לעזור לנו למצוא טוב יותר את המנות, סמנו את הקבלה',
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
      return { ...state, sharersCount: action.count };
    case 'SET_PINCODE':
      return { ...state, pincode: action.payload };
    //todo: think if it's necessary
    case 'FINISHED_SELECT_ITEMS':
      return { ...state, finishedCount: action.finishedCount };
    case 'CHECKED_ITEMS':
      return { ...state, checkedItems: action.checkedItems };
    case 'FINISHED_CALC':
      return { ...state, paymentPerUser: action.paymentPerUser };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
