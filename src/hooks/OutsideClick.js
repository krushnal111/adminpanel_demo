import { useEffect } from "react";
/******************* 
@Purpose : Used for outer click action handle
@Parameter : ref, onClose
@Author : INIC
******************/
export const useOnClickOutside = (ref, onClose) => {
  useEffect(() => {
    /******************* 
    @Purpose : Used for Escape listener handle
    @Parameter : e
    @Author : INIC
    ******************/
    const escapeListener = (e) => {
      if (e.key === "Escape") onClose();
    };
    /******************* 
    @Purpose : Used for click listener handle
    @Parameter : e
    @Author : INIC
    ******************/
    const clickListener = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("click", clickListener);
    document.addEventListener("keyup", escapeListener);

    return () => {
      document.removeEventListener("click", clickListener);
      document.removeEventListener("keyup", escapeListener);
    };
  }, [ref, onClose]);
};
