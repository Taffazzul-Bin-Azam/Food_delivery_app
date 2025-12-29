import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';
import{toast} from 'react-toastify';

const FoodItem = ({id,name,price,description,image }) => {


    const {cartItems,addToCart,removeFromCart,url,currency} = useContext(StoreContext);

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={url+"/images/"+image} alt="" />

{cartItems[id] > 0 && (
  <div className="food-item-counter">
    <img
      onClick={() => removeFromCart(id)}
      src={assets.remove_icon_red}
      alt=""
    />
    <p>{cartItems[id]}</p>
    <img
      onClick={() => addToCart(id)}
      src={assets.add_icon_green}
      alt=""
    />
  </div>
)}
<button
  className="food-item-add-btn"
  onClick={() => {
    addToCart(id);
    toast.success(`${name} added to cart ✅`, {
      position: "top-right",
      autoClose: 2000,
      theme: "colored"
    });
  }}
>
  Add to Cart
</button>

            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p> 
                    <img src={assets.rating_starts} alt="" />
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">{currency}{price}</p>
            </div>
        </div>
    )
}

export default FoodItem
