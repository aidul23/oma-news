export const getWeeklyData = (data) => {
    const weeks = [];
    data.forEach((item, idx) => {
      const week = Math.floor(idx / 7); // Group by 7 items per week
      if (!weeks[week]) {
        weeks[week] = { ...item, date: `Week ${week + 1}` };
      } else {
        weeks[week].positive += item.positive;
        weeks[week].negative += item.negative;
        weeks[week].neutral += item.neutral;
      }
    });
    return weeks;
  };

export  const getMonthlyData = (data) => {
    const months = [];
    data.forEach((item) => {
      const month = item.date.split("-")[1]; // Extract the month from the date (e.g., "2024-01-01" -> "01")
      if (!months[month]) {
        months[month] = { ...item, date: `Month ${month}` };
      } else {
        months[month].positive += item.positive;
        months[month].negative += item.negative;
        months[month].neutral += item.neutral;
      }
    });
    return months;
  };  
