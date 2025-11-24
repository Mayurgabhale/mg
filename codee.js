const point = {
    x: cityIndexMap[city],
    y: dynamicY,
    name: dev.name || null,
    ip: dev.ip || null,
    city: city
};






plugins: {
    tooltip: {
        callbacks: {
            label: (ctx) => {
                const d = ctx.raw;
                const lines = [];

                if (d.name && d.name !== "Unknown") {
                    lines.push(`Name: ${d.name}`);
                }

                if (d.ip && d.ip !== "N/A") {
                    lines.push(`IP: ${d.ip}`);
                }

                lines.push(`City: ${d.city}`);

                return lines;
            }
        }
    }
}