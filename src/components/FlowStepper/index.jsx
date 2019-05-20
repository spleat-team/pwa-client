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
import { pink } from '@material-ui/core/colors';
import ReceiptShootForm from './Steps/ReceiptShoot';
import ReceiptCropper from './Steps/ReceiptCropper';
import SharersCountForm from './Steps/SharersCountForm';
import useLogger from '../../Utils/useLogger';

const VerticalLinearStepper = props => {
  const { state, dispatch } = React.useContext(Store);
  const [activeStep, setActiveStep] = React.useState(0);

  useLogger('VerticalLinearStepper');

  // This controls the logic of when to send the photo and where
  React.useEffect(() => {
    console.log('status changed to : ', state);
    switch (state.status) {
      case ReceiptLifecycle.FILE_LOADED:
        console.log('Changing to check...');
        state.doesLoadedImage &&
          handleFlowChange(state.photo, ReceiptLifecycle.CHECK_RECEIPT);
        break;
      case ReceiptLifecycle.CHECK_RECEIPT:
        console.log('Changing to find_edges...');
        state.hasReceiptInPhoto &&
          handleFlowChange(state.photo, ReceiptLifecycle.FIND_EDGES);
        break;
      case ReceiptLifecycle.FIND_EDGES:
        console.log('Changing to extract...');
        state.doesLoadedImage &&
          state.hasReceiptInPhoto &&
          handleFlowChange(state.photo, ReceiptLifecycle.EXTRACT_ITEMS);
        break;
      default:
        console.log('Not an interesting status...');
    }
  }, [state.status]);

  React.useEffect(() => {
    console.log('DAM');
  });

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
      color: '#80bdff',
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
      func: () => ReceiptCropper(classes, handleBack, handleNext),
    },
    {
      title: 'הכנסת פרטי שולחן',
      func: () => SharersCountForm(classes, handleBack, handleNext),
    },
    {
      title: 'שיתוף עם חברים',
      func: () => <p>Yay me!!!</p>,
    },
  ];

  const sendPhoto = async (photo, url) => {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      },
    };
    const formData = new FormData();
    formData.append('photo', photo);
    dispatch({
      type: 'TOGGLE_LOADING',
    });
    return await post(url, formData, config);
  };

  const handleFlowChange = async (photo, newStage) => {
    const ans = await sendPhoto(photo, newStage.url);
    dispatch({
      type: newStage,
      payload: ans.data,
    });
  };

  return (
    <div id="kaki" className={classes.root}>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        style={{
          direction: 'rtl',
          margin: '5%',
          background: 'rgba(255, 255, 255, 0.49)',
          borderRadius: '10px',
        }}
      >
        {stepsVector.map(({ title, func }, index) => (
          <Step key={title}>
            <StepLabel style={{ color: pink }}>{title}</StepLabel>
            <StepContent>
              <div>{func()}</div>
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
};

export default VerticalLinearStepper;

//style={{direction: 'rtl', marginLef: '0', marginRight: '18px', borderLeft: 'none', borderRight: '1px solid #bdbdbd'}}

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
// };

