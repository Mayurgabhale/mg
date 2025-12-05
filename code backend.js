function convertToBackendFields(type, body) {
    const mapped = { ...body };

    switch (type) {
        case "cameras": 
            mapped.cameraname = body.name; 
            break;

        case "controllers": 
            mapped.controllername = body.name; 
            break;

        case "archivers": 
            mapped.archivername = body.name; 
            break;

        case "servers": 
            mapped.servername = body.name; 
            break;

        case "pc_details":  // backend type
            mapped.hostname = body.hostname;   // ✅ FIX
            mapped.pc_name = body.pc_name;
            break;

        case "dbdetails":
            mapped.hostname = body.hostname;    // also FIX
            break;
    }

    delete mapped.name;
    return mapped;
}