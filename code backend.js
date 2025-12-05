router.get("/regions/details/:region", async (req, res) => {
  try {
    const region = req.params.region;
    const data = await fetchRegionData(region);

    // DO NOT merge controllers + controller_doors
    // JUST RETURN THE DETAILS OBJECT AS IS
    res.json({
      status: "success",
      details: data.details
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});