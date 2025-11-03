// Add these imports at the top
import { FiSun, FiMoon } from "react-icons/fi";

const EmployeeTravelDashboard = () => {
    const [file, setFile] = useState(null);
    const [items, setItems] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        country: "",
        legType: "",
        search: "",
        status: ""
    });
    const [selectedTraveler, setSelectedTraveler] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    
    // 🆕 Add theme state
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    // 🆕 Toggle theme function
    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };