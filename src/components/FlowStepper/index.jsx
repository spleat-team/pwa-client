import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Fab from '@material-ui/core/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Store } from '../../Store';
import ReceiptLifecycle from '../../ReceiptLifecycle';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import axios, { post } from 'axios';
import { pink } from '@material-ui/core/colors';

var classNames = require('classnames');

function VerticalLinearStepper(props) {
    const { state, dispatch } = React.useContext(Store);
    const [activeStep, setActiveStep ] = React.useState(0);
    const [sharersCount, setSharersCount ] = React.useState(0);
    const [sharersCountDirty, setSharersCountDirty ] = React.useState(false);
    
    // let imageRef = null;

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
       // const imageFlowHandler = {
    //     CHECK_RECEIPT: (img) => state.doesLoadedImage? handleFlowChange(img, ReceiptLifecycle.CHECK_RECEIPT): non,
    //     FIND_EDGES: (img) => state.hasReceiptInPhoto ? handleFlowChange(img, ReceiptLifecycle.FIND_EDGES):non,
    //     EXTRACT_ITEMS: (img) => state.doesLoadedImage && state.hasReceiptInPhoto? handleFlowChange(img, ReceiptLifecycle.EXTRACT_ITEMS): non,
    // }

      // console.log("status: ", state.status);
      // const nextStatus = state.status.shouldStartFlow? 0 : state.status.id? state.status.id + 1: '';
      // console.log("next status is : ", nextStatus);
      // if (nextStatus) {
      //     console.log("goind to state : ", Object.keys(imageFlowHandler)[nextStatus]);
      //     imageFlowHandler[Object.keys(imageFlowHandler)[nextStatus]](state.photo)
      // }
},[state.status]);

    const classes = theme => ({
      root: {
        direction: 'rtl',
      },
      textField: {
        flexBasis: 100,
      },
      textField_success: {
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
      margin: {
        margin: theme.spacing.unit,
      },
      button: {
        marginTop: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit,
      },
      backButton: {
        marginTop: theme.spacing.unit * 2,
        width: '20px',
      },
      actionsContainer: {
        marginBottom: theme.spacing.unit,
      },
      resetContainer: {
        padding: theme.spacing.unit,
      },
      doneLabel: {
        color: '#80bdff'
      }
    });

    // const onImageLoaded = (image, crop) => {
      // imageRef = image;
  // };
  
  const onCropChange = crop => dispatch({type: 'NEW_CROP', payload: crop});


  const getReceiptCanvas = () => {
    const { crop, src, preMessage, errorMessage} = state;
    
    return (
      <div>
        <p style={{direction: 'rtl', marginLeft: '10%', marginRight: '10%'}}>{errorMessage ? errorMessage : preMessage}</p>
        {src && (<ReactCrop 
          src={src} 
          crop={crop}
          onComplete={onCropChange}
          // onImageLoaded={onImageLoaded}
          onChange={onCropChange}
          />
        )}
        <div>
        <Button
          variant="outlined"
          onClick={handleBack}
          style={{width: '20px'}}
          className={classes.backButton}>
          חזרה
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          style={{width: '60px', marginRight: '10px'}}
          color='primary'
          className={classes.button}>
          הבא
        </Button>
        </div>
      </div>
    )
  }

  const getForm = () => {
    
    return (
      <form onSubmit={onFormSubmit}>
          <input 
            accept="image/*" 
            className={classes.input} 
            id="raised-button-file" 
            multiple 
            type="file"
            onChange={onSelectFile}
          /> 
          <label htmlFor="raised-button-file"> 
            <Fab color="primary" aria-label="צלם" type="file" component="span" className={classes.button}>
              <FontAwesomeIcon icon={faCamera} />
            </Fab> 
          </label> 
      </form>
    );
  }

  const getInput = () => {
    let inputProps = sharersCount > 1 ? {endAdornment: <InputAdornment position="end">סועדים</InputAdornment>}: {};
    let inputState = classNames({
      'classes.margin': true, 
      'classes.textField': true, 
      'classes.textField_success': true
    });

    return (
      <form onSubmit={handleNext}>
        <TextField
          autoFocus
          style={{marginTop: '15px'}}
          id="outlined-simple-start-adornment"
          className={inputState}
          variant="outlined"
          label="כמות סועדים בארוחה"
          type="number"
          InputProps={inputProps}
          onChange={(event) => {
            setSharersCountDirty(true)
            setSharersCount(event.target.value)}
          }
          value={sharersCountDirty ? sharersCount: ''}
          helperText={sharersCountDirty && sharersCount == 0 ? 'אחי.....':'' }
          error={sharersCountDirty && sharersCount == 0}
        />
        { (sharersCountDirty && sharersCount > 0) &&
          (<Button
            type='submit'
            variant="contained"
            color="primary"
            style={{width: '90px', marginTop: '15px'}}
            onClick={handleNext}
            className={classes.button}>
            סיימתי!
          </Button>)
        }
      </form>
    );
  }
  
  const stepsVector = 
    [{title: 'צילום הקבלה', func: getForm}, 
      {title: 'וידוא המנות', func: getReceiptCanvas},
      {title: 'הכנסת פרטי שולחן', func: getInput},
      {title: 'שיתוף עם חברים', func: () => <p>Yay me!!!</p>},
    ];

    const onFormSubmit = e => {
        // TODO : Navigate to sanduri's page with the router
        console.log("onFormSubmit", e, state);
        e.preventDefault()
    }
    
    const onSelectFile = e => {
      setActiveStep(activeStep + 1)
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

  const handleNext = (event) => {
      if (event != null) {
        event.preventDefault();
      } 
      setActiveStep(activeStep + 1)
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  };

  const handleReset = () => {
      setActiveStep(0)
  };

    // const steps = getSteps();

//style={{direction: 'rtl', marginLef: '0', marginRight: '18px', borderLeft: 'none', borderRight: '1px solid #bdbdbd'}}
      return (
        <div id="kaki" className={classes.root}>
          <Stepper activeStep={activeStep} orientation="vertical" style={{direction: 'rtl', margin: '5%', background: 'rgba(255, 255, 255, 0.49)', borderRadius: '10px'}}>
            {stepsVector.map(({title, func}, index) => (
              <Step key={title}>
                <StepLabel style={{color: pink}}>{title}</StepLabel>
                <StepContent>
                  <div>{func()}</div>
                  <div className={classes.actionsContainer}>
                    <div>
                      { 
                        // (activeStep != 0) && <Button
                        //   variant="outlined"
                        //   disabled={activeStep === 0}
                        //   onClick={handleBack}
                        //   style={{width: '20px'}}
                        //   className={classes.backButton}>
                        //   חזרה
                        // </Button>
                      }
                    </div>
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === stepsVector.length && (
            <Paper square elevation={0} className={classes.resetContainer}>
              <Typography>All steps completed - you&apos;re finished</Typography>
              <Button onClick={handleReset} className={classes.button}>
                Reset
              </Button>
            </Paper>
          )}
        </div>
    );
  }

  export default VerticalLinearStepper