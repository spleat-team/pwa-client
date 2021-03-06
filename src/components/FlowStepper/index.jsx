import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Store } from '../../Store';
import ReceiptLifecycle from '../../ReceiptLifecycle';
import { post } from 'axios';
import ReceiptShootForm from './Steps/ReceiptShoot';
import ReceiptCropper from './Steps/ReceiptCropper';
import SharersCountForm from './Steps/SharersCountForm';
import SharePinCode from './Steps/PinCode';
import useLogger from '../../Utils/useLogger';
import { withStyles } from '@material-ui/core/styles';

const VerticalLinearStepper = props => {
  const { state, dispatch } = React.useContext(Store);
  const [activeStep, setActiveStep] = React.useState(0);

  useLogger('VerticalLinearStepper');

  React.useEffect(() => {
    console.log('activeStep changed to :', activeStep);
  }, [activeStep]);

  // This controls the logic of when to send the photo and where
  React.useEffect(() => {
    switch (state.status) {
      case ReceiptLifecycle.FILE_LOADED:
        if (state.doesLoadedImage) {
          handleFlowChange(
            state.photo,
            ReceiptLifecycle.CHECK_RECEIPT,
            ReceiptLifecycle.RECEIPT_CHECKED
          );
        }
        break;
      case ReceiptLifecycle.RECEIPT_CHECKED:
        state.hasReceiptInPhoto &&
          handleFlowChange(
            state.photo,
            ReceiptLifecycle.FIND_EDGES,
            ReceiptLifecycle.EDGES_FOUND
          );
        break;
      case ReceiptLifecycle.EDGES_FOUND:
        handleNext();
        console.log(
          'DAMMMMMMMMMMMMMMMM',
          state.doesLoadedImage,
          state.hasReceiptInPhoto,
          state.userEndedCropping,
          state.actualCrop,  " DIFF : ",
          state.relativeCropDiff,
        );

        if (state.doesLoadedImage && state.hasReceiptInPhoto && state.userEndedCropping) {
          const crop = state.actualCrop;
          const diff = state.relativeCropDiff;
          const realCropSize = Object.assign(
            {},
            { x: crop.x * diff.width },
            { y: crop.y * diff.height },
            { width: crop.width * diff.width },
            { height: crop.height * diff.height }
          );
          console.log('The real crop size is : ', realCropSize);
          // TODO : SEND THE CROPPED PHOTO INSTED THE NORMAL ONE
          handleFlowChange(
            state.photo,
            ReceiptLifecycle.EXTRACT_ITEMS,
            ReceiptLifecycle.RECEIPT_ITEMS_EXTRACTED,
            { crop: realCropSize }
          );
        }
        break;
      default:
        break;
    }
  }, [state.status.type, state.userEndedCropping]);

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
      backgroundColor: '#4197ED',
      color: '#4197ED',
    },
    backButton: {
      marginTop: theme.spacing.unit * 2,
      width: '20px',
    },
    disabledButton: {
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
      color: '#80bdff',
    },
    shareInline: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
    },
    iconStyle: {
      margin: '0 5px 5px',
      cursor: 'pointer',
    },
  });

  const handleNext = event => {
    if (event != null) {
      event.preventDefault();
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const stepsVector = [
    {
      title: 'צילום הקבלה',
      func: () => ReceiptShootForm(classes, handleNext),
    },
    {
      title: 'וידוא המנות',
      func: () => (
        <ReceiptCropper
          classes={classes}
          backCallback={handleBack}
          nextCallback={handleNext}
        />
      ),
    },
    {
      title: 'הכנסת פרטי שולחן',
      func: () => SharersCountForm(classes, handleBack, handleNext),
    },
    {
      title: 'שיתוף עם חברים',
      func: () => SharePinCode(classes, handleBack),
    },
  ];

  const sendPhoto = async (photo, url, extraData) => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      },
    };
    const formData = new FormData();
    formData.append('photo', photo);
    // console.log("appended extraData to the form :", extraData);
    // formData.append('extraData', extraData);
    
    if (!extraData) return await post(url, formData, config);
    else {
      let extraDataAsString = '';
      try {
        extraDataAsString = '?crop=' + parseInt(extraData.crop.x) + ',' + parseInt(extraData.crop.y) + ',' + parseInt(extraData.crop.width) + ',' + parseInt(extraData.crop.height);
      } catch (err) {
        console.log(err);
      }
      return await post(url + extraDataAsString, formData, config);
    }
  };

  const handleFlowChange = async (photo, actionStage, postActionStage, extraData = '') => {
    dispatch({
      type: actionStage,
    });
    let ans = '';
    try {
      ans = await sendPhoto(photo, actionStage.url, extraData);
    } catch (err) {
      if (activeStep > 0) {
        handleBack();
      }
      dispatch({
        type: 'SET_ERROR_MESSAGE',
        message: 'לא הצלחנו לשלוח את הקבלה לשרתים שלנו.. חכו שנייה~2 ונסו שוב!',
      });
      dispatch({ type: 'TOGGLE_LOADING', loading: false });
      return;
    }
    if (postActionStage != null) {
      if (ans == '') {
        dispatch({
          type: 'SET_ERROR_MESSAGE',
          message: state.errorMessage
            ? state.errorMessage
            : 'מצטערים, לא מצאנו מנות בקבלה',
        });
      } else {
        dispatch({
          type: postActionStage,
          payload: ans.data,
        });
      }
    }
  };

  const StyledStepper = withStyles({
    root: {
      direction: 'rtl',
      margin: '5%',
      background: 'rgba(255, 255, 255, 0.49)',
      borderRadius: '10px',
    },
  })(Stepper);

  const StyledStepLabel = withStyles({
    label: {
      fontFamily: 'Assistant, sans-serif',
      fontSize: '16px',
    },
    completed: {
      fontSize: '16px',
    },
    active: {
      fontSize: '20px',
      color: '#4197ED!important',
    },
  })(StepLabel);

  return (
    <div className={classes.root}>
      <StyledStepper activeStep={activeStep} orientation="vertical">
        {stepsVector.map(({ title, func }, index) => (
          <Step key={title}>
            <StyledStepLabel> {title} </StyledStepLabel>
            <StepContent>
              <div>{func()}</div>
            </StepContent>
          </Step>
        ))}
      </StyledStepper>
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
};

export default VerticalLinearStepper;
