plugins: {
    tooltip: {
        callbacks: {
            label: (ctx) => {
                const d = ctx.raw;
                const lines = [];

                // Name check
                if (d.name && d.name.toString().trim() !== "" && d.name !== "Unknown") {
                    lines.push(`Name: ${d.name}`);
                }

                // IP check
                if (
                    d.ip !== null &&
                    d.ip !== undefined &&
                    d.ip.toString().trim() !== "" &&
                    d.ip !== "N/A"
                ) {
                    lines.push(`IP: ${d.ip}`);
                }

                lines.push(`City: ${d.city || "Unknown"}`);

                return lines;
            }
        }
    }
}







const point = {
    x: cityIndexMap[city],
    y: dynamicY,
    name: dev.name?.trim() || null,
    ip: dev.ip?.trim() || null,
    city: city
};