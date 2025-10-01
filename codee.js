current[dedupKey] = {
  Dateonly,
  Swipe_Time,
  EmployeeID,
  ObjectName1,
  CardNumber,
  PersonnelType,
  zone: zoneRaw,
  door: Door,
  Direction,
  CompanyName: evt.CompanyName || null,      // ✅ added
  PrimaryLocation: evt.PrimaryLocation || null  // ✅ added
};







if (Direction === 'OutDirection') {
  if (zoneLower === 'out of office') {
    uniquePeople.delete(dedupKey);
    delete current[dedupKey];
  } else {
    uniquePeople.set(dedupKey, PersonnelType);
    current[dedupKey] = {
      Dateonly, Swipe_Time, EmployeeID, ObjectName1, CardNumber,
      PersonnelType, zone: zoneRaw, door: Door, Direction,
      CompanyName: evt.CompanyName || null,      // ✅
      PrimaryLocation: evt.PrimaryLocation || null // ✅
    };
  }
  continue;
}

if (Direction === 'InDirection') {
  uniquePeople.set(dedupKey, PersonnelType);
  current[dedupKey] = {
    Dateonly, Swipe_Time, EmployeeID, ObjectName1, CardNumber,
    PersonnelType, zone: zoneRaw, door: Door, Direction,
    CompanyName: evt.CompanyName || null,      // ✅
    PrimaryLocation: evt.PrimaryLocation || null // ✅
  };
  continue;
}