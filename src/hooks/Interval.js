import { useEffect, useRef } from "react";
/******************* 
@Purpose : Used for interval data call
@Parameter : callback, delay
@Author : INIC
******************/
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  
  /******************* 
  @Purpose : Remember the latest callback.
  @Parameter : {}
  @Author : INIC
  ******************/
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  /******************* 
  @Purpose : Set up the interval.
  @Parameter : {}
  @Author : INIC
  ******************/
  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
