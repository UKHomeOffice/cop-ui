export const formatPriority = (priority) => {
  if (priority === 50) {
    return 'Low';
  }
  if (priority === 100) {
    return 'Medium';
  } if (priority === 150) {
    return 'High';
  }
  return null;
};
