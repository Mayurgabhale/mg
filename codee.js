const addTraveler = async () => {
  try {
    await axios.post("http://localhost:8000/add_traveler", newTraveler);
    toast.success("Traveler added successfully!");
    setShowAddForm(false);
    setNewTraveler({
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
    // Refresh data after adding
    const res = await axios.get("http://localhost:8000/data");
    const payload = res.data || {};
    setItems(payload.items || []);
    setSummary(payload.summary || {});
  } catch (err) {
    toast.error("Failed to add traveler. Check backend.");
  }
};