tooltip: {
  callbacks: {
    label: (ctx) => {
      const d = ctx.raw;
      return `${d.count || 0}`;
    }
  }
}



...
function updateOfflineChart(offlineDevices) {
  const typeNames = {
    cameras: "Camera",
    archivers: "Archiver",
    controllers: "Controller",
    servers: "CCURE"
  };

  dynamicTypeList = [];
  dynamicTypeIndexMap = {};
  cityIndexMap = {};
  cityCounter = 0;

  // Only valid types
  const filtered = offlineDevices.filter(dev =>
    typeNames.hasOwnProperty(dev.type)
  );

  // Build dynamic Y indexes
  filtered.forEach(dev => {
    const label = typeNames[dev.type];
    if (!(label in dynamicTypeIndexMap)) {
      dynamicTypeIndexMap[label] = dynamicTypeList.length;
      dynamicTypeList.push(label);
    }
  });

  // ✅ GROUP BY CITY + TYPE
  const grouped = {};

  filtered.forEach(dev => {
    const source = dev.device ? dev.device : dev;
    const city = source.city || "Unknown";
    const label = typeNames[dev.type];

    const key = city + "|" + label;

    if (!grouped[key]) {
      grouped[key] = {
        city: city,
        label: label,
        count: 0
      };
    }

    grouped[key].count++;
  });

  // Clear datasets
  offlineChart.data.datasets.forEach(ds => ds.data = []);

  // ✅ Add grouped points (only ONE point per city+type)
  Object.values(grouped).forEach(item => {

    if (!cityIndexMap[item.city]) {
      cityCounter++;
      cityIndexMap[item.city] = cityCounter;
    }

    const dynamicY = dynamicTypeIndexMap[item.label];

    const point = {
      x: cityIndexMap[item.city],
      y: dynamicY,
      count: item.count   // ✅ count stored here
    };

    const dataset = offlineChart.data.datasets.find(
      ds => ds.label === item.label
    );

    if (dataset) {
      dataset.data.push(point);
    }
  });

  // Hide empty
  offlineChart.data.datasets.forEach(ds => {
    ds.hidden = ds.data.length === 0;
  });

  offlineChart.update();
}