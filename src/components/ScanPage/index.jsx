import React, { useContext } from 'react';
import './ScanPage.css';
import VerticalStepper from '../FlowStepper/index';
import { Store } from '../../Store';
import useLogger from '../../Utils/useLogger';

const ScanPage = props => {
  const { state } = useContext(Store);
  useLogger('ScanPage');
  // const hellowMsg = `היי ${state.user.displayName}!`;
  return (
    <React.Fragment>
      <VerticalStepper />
    </React.Fragment>
  );
};

export default ScanPage;
