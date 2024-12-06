export const statChartData = (data) => {
    return {
      labels: ['Positive', 
               'Negative', 
               'Neutral'],
      datasets: [
        {
          data: [data.positive, 
                 data.negative, 
                 data.neutral],
        },
      ],
    };
  };
  
  