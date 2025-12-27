export function dateFormatting(date : string) {
  try {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date string provided:", date);
      return "";
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const locale = 'nb-NO';

    const dateParts = new Intl.DateTimeFormat(locale, dateOptions).formatToParts(dateObj);
    
    let day = '';
    let month = '';
    let year = '';

    for (const part of dateParts) {
      if (part.type === 'day') {
        day = part.value;
      } else if (part.type === 'month') {
        month = part.value;
      } else if (part.type === 'year') {
        year = part.value;
      }
    }

    if (month.length > 0) {
      month = month.charAt(0).toUpperCase() + month.slice(1);
    }
    
    const formattedDate = `${day} ${month} ${year}`;

    const formattedTime = new Intl.DateTimeFormat(locale, timeOptions).format(dateObj);

    const result = `${formattedDate}, ${formattedTime}`;

    return result;

  } catch (error) {
    console.error("Error during date formatting:", error);
    return "";
  }
}