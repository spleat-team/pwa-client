
import React, { useContext } from 'react';
import './ScanPage.css';
import VerticalStepper from '../FlowStepper/index';
import { Store } from '../../Store';
import useLogger from '../../Utils/useLogger';

const ScanPage = props => {
  const { state, dispatch } = useContext(Store);
  useLogger('ScanPage');

  console.log(`Rendering ScanPage with user : ${state.user}`);

  return (
    <React.Fragment>
      <p>היי {state.user.displayName} !</p>
      <VerticalStepper />
    </React.Fragment>
  );
};

export default ScanPage;
