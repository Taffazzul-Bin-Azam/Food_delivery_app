import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { toast, Slide } from 'react-toastify';
import './Verify.css';

const Verify = () => {
  const { url } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const navigate = useNavigate();

  const verifyPayment = async () => {
    const response = await axios.post(url + "/api/order/verify", { success, orderId });

    if (response.data.success) {
      // ✅ show toast with slide animation
      toast.success("Order placed successfully!", {
        transition: Slide,
        autoClose: 1500,
        theme: "colored",
        position: "top-right"
      });

      // wait until toast is visible then redirect
      setTimeout(() => {
        navigate("/myorders");
      }, 1500);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
