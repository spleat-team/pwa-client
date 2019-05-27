/* eslint-disable no-unused-expressions */
import { useEffect, useRef } from 'react';

const useLogger = (componentName, ...rest) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    // console.log(`${componentName} mounted`, ...rest);
    // return () => console.log(`${componentName} unmounted`);
  }, []);

  useEffect(() => {
    // isInitialMount.current
    //   ? () => (isInitialMount.current = false)
    //   : () => console.log(`${componentName} updated`, ...rest);
  });
};

export default useLogger;
