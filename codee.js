// if (!live || !history) return <LoadingSpinner />;
// const today  = history.summaryByDate.at(-1).region;

if (!live) return <LoadingSpinner />;

// compute today's counts only for this partition
const partitionDetails = (live.details || []).filter(
  r => r.PartitionName2 === partition
);

const seen = new Set();
let todayTotal = 0, todayEmp = 0, todayCont = 0;

partitionDetails.forEach(r => {
  if (seen.has(r.PersonGUID)) return;   // only first swipe per person
  seen.add(r.PersonGUID);
  todayTotal++;
  if (r.PersonnelType === 'Employee' ||
      r.PersonnelType === 'Terminated Employee' ||
      r.PersonnelType === 'Terminated Personnel')
    todayEmp++;
  else
    todayCont++;
});

const today = { total: todayTotal, Employee: todayEmp, Contractor: todayCont };