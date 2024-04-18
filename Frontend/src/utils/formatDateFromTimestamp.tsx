const formatDateFromTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12; // If hours is 0, set it to 12

  const minutesString: string = minutes < 10 ? "0" + minutes : String(minutes);
  const timeString = hours + ":" + minutesString + " " + ampm;

  return timeString;
};

export default formatDateFromTimestamp;
