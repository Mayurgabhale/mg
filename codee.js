const [showAddForm, setShowAddForm] = useState(false);
const [newTraveler, setNewTraveler] = useState({
  first_name: "",
  last_name: "",
  emp_id: "",
  email: "",
  begin_dt: "",
  end_dt: "",
  from_location: "",
  from_country: "",
  to_location: "",
  to_country: "",
  leg_type: "",
});