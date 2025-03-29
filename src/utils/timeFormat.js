export function timeFormatter(isoDate){
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
    };
    
    const formattedDate = new Date(isoDate).toLocaleString("en-US", options);
    return formattedDate

}