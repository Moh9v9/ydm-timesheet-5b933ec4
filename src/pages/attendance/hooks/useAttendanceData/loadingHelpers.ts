
export const determineIsLoading = (
  employeesLoading: boolean,
  dataFetched: boolean,
  isLoading: boolean
) => {
  if (employeesLoading && !dataFetched) {
    return true;
  }
  if (isLoading) {
    return true;
  }
  return false;
};
