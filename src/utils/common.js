import {OptionTasks} from '../const.js';
import moment from "moment";

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

export const isLimitDescriptionLength = (description) => {
  const length = description.length;
  return length >= OptionTasks.MIN_DESCRIPTION_LENGTH &&
    length <= OptionTasks.MAX_DESCRIPTION_LENGTH ? true : false;
};
