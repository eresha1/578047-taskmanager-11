const getOverdueTasksCount = (tasks) => {
  return tasks.reduce((accumulator, task) => {
    if (task.dueDate && task.dueDate.toLocaleDateString() < (new Date()).toLocaleDateString()) {
      accumulator++;
    }
    return accumulator;
  }, 0);
};

const getTodayTasksCount = (tasks) => {
  return tasks.reduce((accumulator, task) => {
    if (task.dueDate && task.dueDate.toLocaleDateString() === (new Date()).toLocaleDateString()) {
      accumulator++;
    }
    return accumulator;
  }, 0);
};

const getRepeatingTasksCount = (tasks) => {
  return tasks.reduce((accumulator, task) => {
    if (task.repeatingDays && Object.values(task.repeatingDays).includes(true)) {
      accumulator++;
    }
    return accumulator;
  }, 0);
};

const getFavoriteTasksCount = (tasks) => {
  return tasks.reduce((accumulator, task) => {
    if (task.isFavorite) {
      accumulator++;
    }
    return accumulator;
  }, 0);
};

const getArchiveTasksCount = (tasks) => {
  return tasks.reduce((accumulator, task) => {
    if (task.isArchive) {
      accumulator++;
    }
    return accumulator;
  }, 0);
};

const getAllTasksCount = (tasks) => {
  return tasks.length - getArchiveTasksCount(tasks);
};

const filterNames = [
  `all`, `overdue`, `today`, `favorites`, `repeating`, `archive`
];

const FilterCount = {
  'all': getAllTasksCount,
  'overdue': getOverdueTasksCount,
  'today': getTodayTasksCount,
  'favorites': getFavoriteTasksCount,
  'repeating': getRepeatingTasksCount,
  'archive': getArchiveTasksCount
};

const generateFilters = (tasks) => {
  return filterNames.map((it) => {
    return {
      name: it,
      count: FilterCount[`${it}`](tasks)
    };
  });
};

export {
  generateFilters
};
