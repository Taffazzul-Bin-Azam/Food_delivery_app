import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <div className='header'>
            <div className='header-contents'>
                <h2>Order <span>Now!</span></h2>

                <p>
                    Choose from a diverse menu featuring a delectable array of dishes 
                    crafted with the finest ingredients.
                </p>

                {/* 🔥 Redirect to Menu Page */}
                <button onClick={() => navigate('/menu')}>
                    View Menu
                </button>
            </div>
        </div>
    );
};

export default Header;
