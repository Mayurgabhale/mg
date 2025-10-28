const [pastUploads, setPastUploads] = useState([]);

const fetchUploads = async () => {
    try {
        const res = await axios.get("http://localhost:8000/uploads");
        setPastUploads(res.data.uploads || []);
        toast.success("Fetched past uploads.");
    } catch (err) {
        console.error(err);
        toast.error("Failed to fetch uploads.");
    }
};