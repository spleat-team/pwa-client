import { useState } from 'react';
import * as Cookies from 'js-cookie';

export function useCookie(key, initialValue) {
  const [item, setInnerValue] = useState(() => {
    return Cookies.get(key) || initialValue;
  });

  const setValue = (value, options) => {
    setInnerValue(value);
    Cookies.set(key, value, options);
  };

  const removeCookie = () => {
    Cookies.remove(key);
  };

  return [item, setValue, removeCookie];
}

export default useCookie;
