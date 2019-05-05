import React from "react";
import { Link } from '@reach/router';
import { Store } from '../../Store';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import './ScanPage.css';
import ReceiptLifecycle from '../../ReceiptLifecycle';
import axios, { post } from 'axios';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Fab from '@material-ui/core/Fab';
import VerticalStepper from '../FlowStepper'


function ScanPage(props) {

    const { state, dispatch } = React.useContext(Store);
    let imageRef = null;

    const onFormSubmit = e => {
        // TODO : Navigate to sanduri's page with the router
        console.log("onFormSubmit", e, state);
        e.preventDefault()
    }
    
    const onSelectFile = e => {
        console.log("file loaded......");
        if (e.target.files && e.target.files.length > 0) {
            dispatch({type: ReceiptLifecycle.NO_FILE});
            const img = e.target.files[0];
            dispatch({type: ReceiptLifecycle.FILE_CHOOSED, payload: img})
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                dispatch({
                    type: ReceiptLifecycle.FILE_LOADED,
                    payload: reader.result
                });
            });
            reader.readAsDataURL(img);
        }
    };

    const sendPhoto = async (photo, url) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                "Access-Control-Allow-Origin": "*",
            }
        }
        const formData = new FormData();
        formData.append('photo', photo)
        dispatch({
            type: 'TOGGLE_LOADING'
        });
        const retVal = await post(url, formData, config);

        return retVal;
    }

    const handleFlowChange = async (photo, newStage) => {
        const ans = await sendPhoto(photo, newStage.url);
        dispatch({
            type: newStage,
            payload: ans.data
        });
    };

    // const non = () => console.log("Something bad happened..")

    // const imageFlowHandler = {
    //     CHECK_RECEIPT: (img) => state.doesLoadedImage? handleFlowChange(img, ReceiptLifecycle.CHECK_RECEIPT): non,
    //     FIND_EDGES: (img) => state.hasReceiptInPhoto ? handleFlowChange(img, ReceiptLifecycle.FIND_EDGES):non,
    //     EXTRACT_ITEMS: (img) => state.doesLoadedImage && state.hasReceiptInPhoto? handleFlowChange(img, ReceiptLifecycle.EXTRACT_ITEMS): non,
    // }

    React.useEffect(() => {
        console.log("Status changed to : ", state)
        switch(state.status) {
            case ReceiptLifecycle.FILE_LOADED:
                console.log("Changing to check...");
                state.doesLoadedImage && handleFlowChange(state.photo, ReceiptLifecycle.CHECK_RECEIPT);
                break;
            case ReceiptLifecycle.CHECK_RECEIPT:
                console.log("Changing to find_edges...");
                state.hasReceiptInPhoto && handleFlowChange(state.photo, ReceiptLifecycle.FIND_EDGES);
                break;
            case ReceiptLifecycle.FIND_EDGES:
                console.log("Changing to extract...");
                state.doesLoadedImage && state.hasReceiptInPhoto && handleFlowChange(state.photo, ReceiptLifecycle.EXTRACT_ITEMS);
                break;
            default: 
                console.log("Not an interesting status...");
        }
        // console.log("status: ", state.status);
        // const nextStatus = state.status.shouldStartFlow? 0 : state.status.id? state.status.id + 1: '';
        // console.log("next status is : ", nextStatus);
        // if (nextStatus) {
        //     console.log("goind to state : ", Object.keys(imageFlowHandler)[nextStatus]);
        //     imageFlowHandler[Object.keys(imageFlowHandler)[nextStatus]](state.photo)
        // }
	},[state.status]);
    
    const onImageLoaded = (image, crop) => {
        imageRef = image;
    };
    
    const onCropChange = crop => dispatch({type: 'NEW_CROP', payload: crop});

    const { crop, src, preMessage, errorMessage} = state;

	return (
		<React.Fragment>
            
            <VerticalStepper/>
		</React.Fragment>
	);
}

export default ScanPage;