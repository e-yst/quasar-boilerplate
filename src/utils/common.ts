export const getDateFromISO = (isoDateStr: string): Date => {
  const timestamp = Date.parse(isoDateStr);
  return new Date(timestamp);
};
