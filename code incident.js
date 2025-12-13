<option value="LT.Vilnius">LT.Vilnius</option>
<option value="Quezon City">Quezon City</option>
like this name 

function isNoGreenLocation(row) {
          const z = String(row.Zone || '').toLowerCase();
          return (
            z.includes('quezon') ||
            z.includes('vilnius')
          );
}
