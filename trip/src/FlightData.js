const cities = ["Dubai", "Paris", "London", "New York","Canada","Malayasia","Singapore","Maldives","GreenLand","India"];

const generateFlightData = () => {
  const currentDate = new Date().toISOString().split('T')[0]; // Get present date in yyyy-MM-dd format

  let flights = [];
  let flightIndex = 1;
  cities.forEach((from, fromIndex) => {
    cities.forEach((to, toIndex) => {
      if (fromIndex !== toIndex) {
        flights.push({
          flightName: `Flight ${flightIndex}`,
          from: from,
          to: to,
          date: currentDate,
          cost : (Math.random() * (7500-6500) + 6500).toFixed(3)
        });
        flightIndex++;
      }
    });
  });
  return flights;
};

const flightData = generateFlightData();
console.log(flightData);
export default flightData;
