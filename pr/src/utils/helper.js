export const formatDate=(date)=>{
const originalDate = new Date(date);
const day = originalDate.getDate();
const month = originalDate.getMonth() + 1; // Adding 1 to get the correct month (0-based index)
const year = originalDate.getFullYear();
// Format the date as DD-MM-YYYY
const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

return formattedDate
}


export const formatDatesForApi = (dates) => {
  if (Array.isArray(dates)) {
    // Handle multiple dates
    return dates.map((date) => {
      if (date instanceof Date) {
        return date.toISOString();
      } else {
        // Handle cases where the date might be in a different format
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate)) {
          return parsedDate.toISOString();
        } else {
          // Handle invalid date format as needed
          return null;
        }
      }
    });
  } else if (dates instanceof Date) {
    // Handle a single date
    return [dates.toISOString()];
  } else {
    // Handle other cases (e.g., date in a different format)
    const parsedDate = new Date(dates);
    if (!isNaN(parsedDate)) {
      return [parsedDate.toISOString()];
    } else {
      return [];
    }
  }
};
 