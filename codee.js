const det = json.details
  .filter(r => r.PartitionName2 === partition)
  .map(r => {
    const floor =
      lookupFloor(r.PartitionName2, r.Door, r.Direction);

    // 🧠 Handle out direction logic
    if (r.Direction === 'OutDirection') {
      if (floor?.toLowerCase().includes('office')) {
        // 🚫 Skip out-of-office
        return null;
      } else {
        // ✅ Map to other floor (if defined)
        return { ...r, floor };
      }
    }

    // ✅ InDirection — normal mapping
    return { ...r, floor };
  })
  .filter(Boolean); // remove nulls