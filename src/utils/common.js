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

export const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

export const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isOneDay(date, dueDate);
};

export const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};
