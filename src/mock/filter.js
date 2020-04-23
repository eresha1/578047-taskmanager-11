const generateCountFilters = (tasks) => {
  const today = new Date();
  const overdueCount = tasks.filter((task) => task.dueDate instanceof Date && task.dueDate < today).length;
  const todayCount = tasks.filter((task) => task.dueDate instanceof Date && task.dueDate.getDay() === today.getDay() && task.dueDate.getMonth() === today.getMonth()).length;
  const repeatingCount = tasks.filter((task) => Object.values(task.repeatingDays).includes(true)).length;
  const favoriteCount = tasks.filter((task) => !!task.isFavorite).length;
  const arhiveCount = tasks.filter((task) => !!task.isArchive).length;
  const allCount = tasks.length - arhiveCount;

  return [
    {title: `all`, count: allCount},
    {title: `overdue`, count: overdueCount},
    {title: `today`, count: todayCount},
    {title: `favorites`, count: favoriteCount},
    {title: `repeating`, count: repeatingCount},
    {title: `archive`, count: arhiveCount}
  ];
};


export const generateFilters = (tasks) => {
  return generateCountFilters(tasks).map((it) => {
    return {
      name: it.title,
      count: it.count
    };
  });
};

