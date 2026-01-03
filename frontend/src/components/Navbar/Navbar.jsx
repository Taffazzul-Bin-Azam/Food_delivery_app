import { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false); 
  const { getTotalCartAmount, token, setToken, food_list } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/');
    setMenuOpen(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = food_list.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const handleSelectSuggestion = (itemName) => {
    setSearchTerm(itemName);
    setSuggestions([]);
    navigate(`/?search=${encodeURIComponent(itemName)}`);
    setMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
      setSuggestions([]);
      setMenuOpen(false);
    }
  };

  return (
    <nav className='navbar'>
      <Link to='/' onClick={() => setMenuOpen(false)}>
        <img className='logo' src={assets.logo} alt="logo" />
      </Link>

      {/* Hamburger Icon */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Menu */}
      <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => { setMenu("home"); setMenuOpen(false); }} className={menu === "home" ? "active" : ""}>Home</Link>
        <a href='/menu' onClick={() => { setMenu("menu"); setMenuOpen(false); }} className={menu === "menu" ? "active" : ""}>Menu</a>
        <a href='#app-download' onClick={() => { setMenu("mob-app"); setMenuOpen(false); }} className={menu === "mob-app" ? "active" : ""}>Mobile App</a>
        <a href='#footer' onClick={() => { setMenu("contact"); setMenuOpen(false); }} className={menu === "contact" ? "active" : ""}>Contact Us</a>
        <a href='/cart' onClick={() => { setMenu("cart"); setMenuOpen(false); }} className={menu === "cart" ? "active" : ""}>My Cart</a>
        {token && (
          <Link to="/myorders" onClick={() => { setMenu("orders"); setMenuOpen(false); }} className={menu === "orders" ? "active" : ""}>
            MyOrders
          </Link>
        )}
      </ul>

      {/* Right Section */}
      <div className="navbar-right">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <input
            type="text"
            placeholder="Search food..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <img src={assets.search_icon} alt="Search" onClick={handleSearchSubmit} />
          {suggestions.length > 0 && (
            <ul className="search-suggestions">
              {suggestions.map((item) => (
                <li key={item._id} onClick={() => handleSelectSuggestion(item.name)}>
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </form>

        {/* Cart */}
        <Link to='/cart' className='navbar-search-icon'>
          <img src={assets.basket_icon} alt="cart" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>

        {/* User */}
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="profile" />
            <ul className='navbar-profile-dropdown'>
              <li onClick={() => { navigate('/myorders'); setMenuOpen(false); }}>
                <img src={assets.bag_icon} alt="" /> <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" /> <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
