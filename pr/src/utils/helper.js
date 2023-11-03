export const formatDate=(date)=>{
const originalDate = new Date(date);
const day = originalDate.getDate();
const month = originalDate.getMonth() + 1; // Adding 1 to get the correct month (0-based index)
const year = originalDate.getFullYear();
// Format the date as DD-MM-YYYY
const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

return formattedDate
}