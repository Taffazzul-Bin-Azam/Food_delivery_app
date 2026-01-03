import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    addToCart,
    getTotalCartAmount,
    url,
    currency,
    deliveryCharge,
    token
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!token) {
      toast.error("⚠ Please login or sign up before proceeding to checkout.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
      return;
    }

    if (getTotalCartAmount() === 0) {
      toast.error("🛒 Your cart is empty. Add some items before checkout!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
      return;
    }

    navigate('/order');
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <hr />

        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>{currency}{item.price}</p>

                  {/* ✅ Quantity Control */}
                  <div className="cart-qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => removeFromCart(item._id)}
                    >
                      −
                    </button>

                    <span className="qty-count">
                      {cartItems[item._id]}
                    </span>

                    <button
                      className="qty-btn"
                      onClick={() => addToCart(item._id)}
                    >
                      +
                    </button>
                  </div>

                  <p>
                    {currency}{item.price * cartItems[item._id]}
                  </p>

                  <p
                    className="cart-items-remove-icon"
                    onClick={() => removeFromCart(item._id)}
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* 🔻 Cart Bottom */}
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{currency}{getTotalCartAmount()}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p>
            </div>

            <hr />

            <div className="cart-total-details">
              <b>Total</b>
              <b>
                {currency}
                {getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + deliveryCharge}
              </b>
            </div>
          </div>

          <button onClick={handleProceedToCheckout}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        {/* Promo Code */}
        <div className="cart-promocode">
          <p>If you have a promo code, enter it here</p>
          <div className="cart-promocode-input">
            <input type="text" placeholder="Promo code" />
            <button>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
