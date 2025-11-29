const preferredOrder = [
  "T.Vilnius",
  "DU.Abu Dhab",
  "ES.Madrid",
  "AUT.Vienna",
  "IE.Dublin",
  "MA.Casablanca",
  "UK.London",
  "IT.Rome",
  "RU.Moscow"
];


const orderedData = preferredOrder.map(name => {
  const loc = byLocation.find(x => x.name === name);
  return loc || { name, count: 0 }; // default 0 if missing
});

const labels = orderedData.map(x => x.name);
const values = orderedData.map(x => x.count);