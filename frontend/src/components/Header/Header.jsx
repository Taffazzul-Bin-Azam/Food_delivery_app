import React from 'react';
import './Header.css';

const Header = () => {
    const scrollToMenu = () => {
        const menuSection = document.getElementById('explore-menu');
        if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className='header'>
            <div className='header-contents'>
                <h2>Order Now !</h2>
                <p>
                    Choose from a diverse menu featuring a delectable array of dishes 
                    crafted with the finest ingredients.
                </p>
                <button onClick={scrollToMenu}>View Menu</button>
            </div>
        </div>
    );
};

export default Header;
