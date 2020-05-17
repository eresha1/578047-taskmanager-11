import AbstractSmartComponent from "./abstract-smart-component.js";
import {COLORS, DAYS} from "../const.js";
import {formatTime, isLimitDescriptionLength, formatDate} from "../utils/common.js";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

const createDateShow = (isDateShowing, date, time) =>
  isDateShowing ?
    `<fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          placeholder=""
          name="date"
          value="${date} ${time}"/>
      </label>
 </fieldset>` : ``;

const createColorsMarkup = (colors, currentColor) => {

  return colors
    .map((color, index) => {
      return (
        `<input
          type="radio"
          id="color-${color}-${index}"
          class="card__color-input card__color-input--${color} visually-hidden"
          name="color"
          value="${color}"
          ${currentColor === color ? `checked` : ``}
        />
        <label
          for="color-${color}-${index}"
          class="card__color card__color--${color}"
          >${color}</label
        >`
      );
    })
    .join(`\n`);
};

const createRepeatingDaysMarkup = (days, repeatingDays) => {
  return days
    .map((day, index) => {
      const isChecked = repeatingDays[day];
      return (
        `<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-${index}"
          name="repeat"
          value="${day}"
          ${isChecked ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-${day}-${index}"
          >${day}</label
        >`
      );
    })
    .join(`\n`);
};

const createRepeatTask = (isRepeatingTask, repeatingDaysMarkup) =>
  isRepeatingTask ? `<fieldset class="card__repeat-days">
    <div class="card__repeat-days-inner">
      ${repeatingDaysMarkup}
    </div>
  </fieldset>` : ``;

const createTaskEditTemplate = (task, options = {}) => {
  const {description, dueDate} = task;
  const {isDateShowing, isRepeatingTask, activeRepeatingDays} = options;
  let {color} = options || task;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();

  const isBlockSaveButton = (isDateShowing && isRepeatingTask) ||
    (isRepeatingTask && !isRepeating(activeRepeatingDays));

  // const date = (isDateShowing && dueDate) ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const date = (isDateShowing && dueDate) ? formatDate(dueDate) : ``;

  const time = (isDateShowing && dueDate) ? formatTime(dueDate) : ``;

  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const colorsMarkup = createColorsMarkup(COLORS, color);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, activeRepeatingDays);

  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>
          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>
          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                </button>
                ${createDateShow(isDateShowing, date, time)}
                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                </button>
                ${createRepeatTask(isRepeatingTask, repeatingDaysMarkup)}
              </div>
              <div class="card__colors-inner">
                <h3 class="card__colors-title">Color</h3>
                <div class="card__colors-wrap">
                  ${colorsMarkup}
                </div>
              </div>
            </div>
          </div>
          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isBlockSaveButton ? `disabled` : ``}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class TaskEdit extends AbstractSmartComponent {
  constructor(task) {
    super();

    this._task = task;
    this._color = task.color;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._flatpickr = null;
    this._submitHandler = null;

    this._applyFlatpickr();

    this._onDateShowing = this._onDateShowing.bind(this);
    this._onRepeatDaysShowing = this._onRepeatDaysShowing.bind(this);
    this._onChangeRepeatDays = this._onChangeRepeatDays.bind(this);
    this._onChangeColor = this._onChangeColor.bind(this);
    this._onChangeDescription = this._onChangeDescription.bind(this);

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTaskEditTemplate(this._task, {
      color: this._color,
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      activeRepeatingDays: this._activeRepeatingDays,
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const task = this._task;

    this._color = task.color;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);

    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      // При своем создании `flatpickr` дополнительно создает вспомогательные DOM-элементы.
      // Что бы их удалять, нужно вызывать метод `destroy` у созданного инстанса `flatpickr`.
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._task.dueDate || `today`,
      });
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__text`)
      .addEventListener(`input`, this._onChangeDescription);

    element.querySelector(`.card__date-deadline-toggle`)
    .addEventListener(`click`, this._onDateShowing);

    element.querySelector(`.card__repeat-toggle`)
    .addEventListener(`click`, this._onRepeatDaysShowing);

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, this._onChangeRepeatDays);
    }

    const colorBar = element.querySelector(`.card__colors-wrap`);
    colorBar.addEventListener(`change`, this._onChangeColor);
  }

  _onDateShowing() {
    this._isDateShowing = !this._isDateShowing;

    this.rerender();
  }

  _onRepeatDaysShowing() {
    this._isRepeatingTask = !this._isRepeatingTask;

    this.rerender();
  }

  _onChangeRepeatDays(evt) {
    this._activeRepeatingDays[evt.target.value] = evt.target.checked;
    this.rerender();
  }

  _onChangeColor(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    this._color = evt.target.value;
    this.rerender();
  }

  _onChangeDescription(evt) {
    this._currentDescription = evt.target.value;

    const saveButton = this.getElement().querySelector(`.card__save`);
    saveButton.disabled = !isLimitDescriptionLength(this._currentDescription);
  }
}
