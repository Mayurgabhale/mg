const labels = [...byLocation].map(x => x.name || 'Unknown');


const values = [...byLocation].map(x => x.count || 0);