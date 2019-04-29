import React from 'react'
import ReceiptLifecycle from './ReceiptLifecycle'

export const Store = React.createContext();

const receiptInfoInitialState = {
    doesLoadedImage: false,
    hasReceiptInPhoto: false,
    receiptCoordinates: [],
    receiptEdges: '',
    receiptItems: '',
    preMessage: 'Please upload the receipt :)',
    errorMessage: '',
    photo: null,
}

const initialState = {
    loading: false,
    src: null,
    crop: {
        width: 200,
        x: 0,
        y: 0
    },
    status: ReceiptLifecycle.NO_FILE,
    ...receiptInfoInitialState,
};

  function reducer(state, action) {
    switch (action.type) {
        case "TOGGLE_LOADING":
            return {...state, loading: !state.loading};
        case ReceiptLifecycle.NO_FILE:
            return {...state, status: ReceiptLifecycle.NO_FILE, loading: false, ...receiptInfoInitialState, errorMessage: '', preMessage: 'Please upload the receipt :)'}
        case ReceiptLifecycle.FILE_CHOOSED:
            return {...state, status: ReceiptLifecycle.FILE_CHOOSED, loading: false, doesLoadedImage: false, photo: action.payload, errorMessage:'', preMessage: 'Validating the receipt...'}
        case ReceiptLifecycle.FILE_LOADED: 
            return {...state, status: ReceiptLifecycle.FILE_LOADED, loading: false, doesLoadedImage: true, src: action.payload, errorMessage: ''}
        case ReceiptLifecycle.CHECK_RECEIPT:
            let errorMessage = !action.payload ? "There is no receipt in the photo.." : "Oops.. Try again please!";
            return {...state, status:ReceiptLifecycle.CHECK_RECEIPT, loading: false, hasReceiptInPhoto: action.payload, errorMessage: errorMessage}
        case ReceiptLifecycle.FIND_EDGES:
            return {...state, status: ReceiptLifecycle.FIND_EDGES, loading: false, receiptEdges: action.payload, errorMessage:'', preMessage: 'Analyzing the receipt...'}
        case ReceiptLifecycle.EXTRACT_ITEMS:
            return {...state, status: ReceiptLifecycle.EXTRACT_ITEMS, loading: false, receiptItems: action.payload, errorMessage:'', preMessage: 'We found your receipt! Is it a good crop?'}
        case "NEW_CROP":
            return {...state, crop: action.payload};
        default:
            return state;
    }
  }


export function StoreProvider(props) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const value = { state, dispatch };

    return <Store.Provider value={value}>{props.children}</Store.Provider>
  }