import {OptionTasks} from '../const.js';

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const isLimitDescriptionLength = (description) => {
  const length = description.length;
console.log(length)
console.log(OptionTasks.MIN_DESCRIPTION_LENGTH, OptionTasks.MAX_DESCRIPTION_LENGTH)
  return length >= OptionTasks.MIN_DESCRIPTION_LENGTH &&
    length <= OptionTasks.MAX_DESCRIPTION_LENGTH ? true : false;
};
