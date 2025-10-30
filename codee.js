import { useLocation } from "react-router-dom";





function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/travel-dashboard";

  return (
    <>
      {!hideNavbar && (
        <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
          {/* all your nav links here */}
        </Navbar>
      )}

      {/* rest of your routes */}
      <Routes>
        {/* all your <Route> definitions */}
      </Routes>
    </>
  );
}