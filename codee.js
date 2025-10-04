import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { MdAddAlert } from "react-icons/md";
import { FaBuildingCircleCheck } from "react-icons/fa6";

function NavbarCustom() {
  useEffect(() => {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  return (
    <>
      <Nav.Link 
        as={Link} 
        to="/" 
        className="nav-item-infographic" 
        data-bs-toggle="tooltip" 
        data-bs-placement="bottom" 
        title="Home"
      >
        <i className="bi bi-house"></i>
      </Nav.Link>

      <Nav.Link 
        as={Link} 
        to="/details" 
        className="nav-item-infographic" 
        data-bs-toggle="tooltip" 
        data-bs-placement="bottom" 
        title="Details Page"
      >
        <i className="fa-solid fa-calendar-day"></i>
      </Nav.Link>

      <Nav.Link 
        as={Link} 
        to="/ert" 
        className="nav-item-infographic"
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        title="ERT Overview"
      >
        <MdAddAlert />
      </Nav.Link>

      <Nav.Link 
        as={Link} 
        to="/companysummary" 
        className="nav-item-infographic"
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        title="Company Summary"
      >
        <FaBuildingCircleCheck />
      </Nav.Link>

      <Nav.Link 
        href="http://10.199.22.57:3000/partition/Pune/history" 
        className="nav-item-infographic"
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        title="History"
      >
        <i className="bi bi-clock-history"></i>
      </Nav.Link>
    </>
  );
}

export default NavbarCustom;