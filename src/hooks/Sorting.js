import { useState } from "react";
/******************* 
@Purpose : Used for shorting data
@Parameter : {}
@Author : INIC
******************/
export const useSorting = () => {
  const [sortData, setSortData] = useState({
    firstName: false,
    lastName: false,
    mobile: false,
    emailId: false,
    role: false,
    templateTitle: false,
    emailKey: false,
    subject: false,
    countryCode: false,
    countryName: false,
    phoneCode: false,
    timezone: false,
    currency: false,
    pageTitle: false,
  });
  const [sort, setSort] = useState({ rate: 1 });
  /******************* 
  @Purpose : Used for handle short
  @Parameter : column
  @Author : INIC
  ******************/
  const onSort = (column) => {
    var element, value;
    for (const key in sortData) {
      if (key == column) {
        sortData[key] = !sortData[key];
        element = key;
        value = -1;
        if (sortData[key]) {
          value = 1;
        }
        setSort({ [element]: value });
        setSortData(sortData);
      } else {
        sortData[key] = false;
      }
    }
    setSortData(sortData);
  };

  return [sortData, sort, onSort];
};
