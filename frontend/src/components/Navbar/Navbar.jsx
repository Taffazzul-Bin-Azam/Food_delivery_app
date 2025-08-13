import { useContext, useState } from 'react'
import './Navbar.css'
import { assets, food_list } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/')
  }

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
    navigate(`/menu?search=${encodeURIComponent(itemName)}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/menu?search=${encodeURIComponent(searchTerm)}`);
      setSuggestions([]);
    }
  };

  return (
    <div className='navbar'>
      <Link to='/'><img className='logo' src={assets.logo} alt="" /></Link>
      
  <ul className="navbar-menu">
  <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>home</Link>
  <a href='#explore-menu' onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>menu</a>
  <a href='#app-download' onClick={() => setMenu("mob-app")} className={`${menu === "mob-app" ? "active" : ""}`}>mobile app</a>
  <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>contact us</a>

  {/* Show Orders link only if logged in */}
  {token && (
    <Link to="/myorders" onClick={() => setMenu("orders")} className={`${menu === "orders" ? "active" : ""}`}>
      MyOrders
    </Link>
  )}
</ul>


      <div className="navbar-right">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <input
            type="text"
            placeholder="Search food..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <img
            src={assets.search_icon}
            alt="Search"
            onClick={handleSearchSubmit}
          />
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

        {/* Basket Icon */}
        <Link to='/cart' className='navbar-search-icon'>
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>

        {!token ? <button onClick={() => setShowLogin(true)}>sign in</button>
          : <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className='navbar-profile-dropdown'>
              <li onClick={()=>navigate('/myorders')}>
                <img src={assets.bag_icon} alt="" /> <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" /> <p>Logout</p>
              </li> 
            </ul>
          </div>
        }
      </div>
    </div>
  )
}

export default Navbar
