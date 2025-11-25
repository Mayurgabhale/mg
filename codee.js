scales: {
  x: {
    title: { display: false, text: "City" },

    ticks: {
      maxRotation: 0,   // ✅ force no rotation
      minRotation: 0,   // ✅ force horizontal

      callback: (value) => {
        return Object.keys(cityIndexMap).find(
          key => cityIndexMap[key] === value
        ) || "";
      }
    }
  },

  y: {
    title: { display: false, text: "Device Type" },
    ticks: {
      callback: v => dynamicTypeList[v] || ""
    },
    min: -0.5,
    max: () => dynamicTypeList.length - 0.5
  }
}