// near top of component state
const [indexByDate, setIndexByDate] = useState({
  detailMap: new Map(),   // date (yyyy-mm-dd) => Array<detailRows>
  summaryMap: new Map()   // date (yyyy-mm-dd) => summaryEntry
});