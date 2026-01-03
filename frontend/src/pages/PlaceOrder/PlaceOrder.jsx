import { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const [payment, setPayment] = useState("cod");

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    setCartItems,
    currency,
    deliveryCharge,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // ================= RAZORPAY =================
  const razorpayPay = async (orderData) => {
    try {
      const res = await axios.post(
        url + "/api/order/razorpay/create",
        orderData,
        { headers: { token } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.order.amount,
        currency: "INR",
        order_id: res.data.order.id,

       handler: async function (response) {
  const verify = await axios.post(
    url + "/api/order/razorpay/verify",
    {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      orderData: orderData,
    },
    { headers: { token } }
  );

  if (verify.data.success) {
    toast.success("Order Placed Successfully 🎉");
    setCartItems({});
    navigate("/myorders");
  } else {
    toast.error("Payment Verification Failed");
  }
}

      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Razorpay Error");
    }
  };

  // ================= PLACE ORDER =================
  const placeOrder = async (e) => {
    e.preventDefault();

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({ ...item, quantity: cartItems[item._id] });
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + deliveryCharge,
    };

    // COD
    if (payment === "cod") {
      const res = await axios.post(
        url + "/api/order/placecod",
        orderData,
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Order Placed Successfully");
        setCartItems({});
        navigate("/myorders");
      } else toast.error("Order Failed");
    }

    // STRIPE
    else if (payment === "stripe") {
      const res = await axios.post(
        url + "/api/order/place",
        orderData,
        { headers: { token } }
      );

      if (res.data.success) {
        window.location.replace(res.data.session_url);
      } else toast.error("Stripe Error");
    }

    // RAZORPAY
    else if (payment === "razorpay") {
      razorpayPay(orderData);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Login first to place order");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-field">
          <input name="firstName" onChange={onChangeHandler} placeholder="First name" required />
          <input name="lastName" onChange={onChangeHandler} placeholder="Last name" required />
        </div>

        <input name="email" onChange={onChangeHandler} placeholder="Email" required />
        <input name="street" onChange={onChangeHandler} placeholder="Street" required />

        <div className="multi-field">
          <input name="city" onChange={onChangeHandler} placeholder="City" required />
          <input name="state" onChange={onChangeHandler} placeholder="State" required />
        </div>

        {/* <div className="multi-field">
          <input name="zipcode" onChange={onChangeHandler} placeholder="Zipcode" required />
          <input name="country" onChange={onChangeHandler} placeholder="Country" required />
        </div> */}

        <input name="phone" onChange={onChangeHandler} placeholder="Phone No" required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <p>Total: {currency}{getTotalCartAmount() + deliveryCharge}</p>
        </div>

        <div className="payment">
          <h2>Payment Method</h2>

          <div onClick={() => setPayment("cod")} className="payment-option">
            <img src={payment === "cod" ? assets.checked : assets.un_checked} />
            <p>COD</p>
          </div>
          
           <div onClick={() => setPayment("razorpay")} className="payment-option">
            <img src={payment === "razorpay" ? assets.checked : assets.un_checked} />
            <p>Razorpay</p>
          </div>

          <div onClick={() => setPayment("stripe")} className="payment-option">
            <img src={payment === "stripe" ? assets.checked : assets.un_checked} />
            <p>Stripe</p>
          </div>

         
        </div>

        <button className="place-order-submit" type="submit">
          {payment === "cod" ? "Place Order" : "Proceed To Payment"}
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
