export const getDayOfYear = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const timeDifference = date.getTime() - startOfYear.getTime();

  return Math.floor(timeDifference / millisecondsInDay);
};

export const getFormattedDate = (date: Date): string => {
  return date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};
