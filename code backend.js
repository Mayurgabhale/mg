async function openEditForDeviceFromIP(ipOrHost){
    try{
        let url = `http://localhost/api/devices?ip=${encodeURIComponent(ipOrHost)}`;
        const res = await fetch(url);
        if(!res.ok) throw new Error(`Device not found (${res.status})`);

        const deviceObj = await res.json();
        showDeviceModal("edit", deviceObj);
    } catch(err){
        console.error(err);
        alert("Cannot load device details: "+err.message);
    }
}