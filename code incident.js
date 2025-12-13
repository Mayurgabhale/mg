<option value="LT.Vilnius">LT.Vilnius</option>
<option value="Quezon City">Quezon City</option>

      // CHANGE IF YOUR API HOST DIFFERS
      const API_BASE = "http://localhost:8002";

      function resolveApiImageUrl(imgUrl) {
        if (!imgUrl) return null;
        try {
          if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) return imgUrl;
          // ensure API_BASE has no trailing slash
          var base = API_BASE.replace(/\/$/, '');
          if (imgUrl.startsWith('/')) return base + imgUrl;
          return base + '/' + imgUrl;
        } catch (e) {
          return imgUrl;
        }
      }


      // --- Region / Location mapping copied from backend/duration_report.REGION_CONFIG (friendly / UI names) ---
      // Keep the keys lowercase to match backend region keys.
      const REGION_OPTIONS = {
        "apac": {
          label: "APAC",
          // Friendly names used by backend normalisation (duration_report) for APAC
          partitions: ["Pune", "Quezon City", "Taguig City", "MY.Kuala Lumpur", "IN.HYD", "SG.Singapore"]
        },
        "emea": {
          label: "EMEA",
          partitions: ["LT.Vilnius", "IT.Rome", "UK.London", "IE.DUblin", "DU.Abu Dhab", "ES.Madrid"]
        },
        "laca": {
          label: "LACA",
          partitions: ["AR.Cordoba", "BR.Sao Paulo", "CR.Costa Rica Partition", "PA.Panama City", "PE.Lima", "MX.Mexico City"]
        },
        "namer": {
          label: "NAMER",
          // show friendly names to the user, but we map them to backend partition tokens before sending
          partitions: ["Denver", "Austin Texas", "Miami", "New York"]
        }
      };

      // Map from UI-friendly location label -> backend search token (used for &city=)
      // For APAC, friendly labels match backend PartitionName2 normalised values so they map to themselves.
      // For NAMER, backend normalisation sets PartitionName2 to tokens like "US.CO.OBS", "USA/Canada Default" etc.
      const LOCATION_QUERY_VALUE = {
        "apac": {
          "Pune": "Pune",
          "Quezon City": "Quezon City",
          "Taguig City": "Taguig City",
          "MY.Kuala Lumpur": "MY.Kuala Lumpur",
          "IN.HYD": "IN.HYD",
          "SG.Singapore": "SG.Singapore"
        },
        "namer": {
          // friendly->backend tokens (this matches the backend duration_report normalisation)
          "Denver": "US.CO.OBS",
          "Austin Texas": "USA/Canada Default",
          "Miami": "US.FL.Miami",
          "New York": "US.NYC"
        },
        // default passthrough for other regions 
        "emea": {},
        "laca": {}
      };

      // Map risk text/colors (same as backend map_score_to_label buckets)
      const RISK_COLORS = {
        "Low": "#10b981",
        "Low Medium": "#86efac",
        "Medium": "#facc15",
        "Medium High": "#fb923c",
        "High": "#ef4444"
      };
      const RISK_LABELS = ["Low", "Low Medium", "Medium", "Medium High", "High"];


like this name 

function isNoGreenLocation(row) {
          const z = String(row.Zone || '').toLowerCase();
          return (
            z.includes('quezon') ||
            z.includes('vilnius')
          );
}
