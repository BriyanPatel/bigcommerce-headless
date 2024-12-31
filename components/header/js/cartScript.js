"use client";
import { useEffect, useState } from 'react';

const CartScript = () => {
    useEffect(() => {
        const headerCartLink = document.querySelector('#header-cart a');
        const closeCartButton = document.querySelector('#close-cart');
        const cartDrawer = document.querySelector('#cart-drawer');
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

        const addClassToBody = (event) => {
            event.preventDefault();
          
            document.body.classList.add('active-cart-modal');
            
        };

        const cartaddClassToBody = (event) => {
          
            document.body.classList.add('active-cart-modal');
        };

        const removeClassFromBody = (event) => {
            event.preventDefault();
            document.body.classList.remove('active-cart-modal');

        };

        const clickremoveClassFromBody = (event) => {
            if (cartDrawer && !(event.target instanceof Node && cartDrawer.contains(event.target)) &&
                !(event.target instanceof Node && headerCartLink.contains(event.target))) {
                document.body.classList.remove('active-cart-modal');
            }
        };

        const checkButtonState = () => {
            addToCartButtons.forEach(button => {
                const observer = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                 
                            if (button.hasAttribute('disabled')) {
                                // Do nothing when the button is disabled
                            } else {
                                // Add the class when the button is enabled
                                if(document.querySelectorAll(".text-error-secondary").length == 0)
                                cartaddClassToBody();
                            }
                        }
                    }
                });

                observer.observe(button, { attributes: true });
            });
        };


        if (headerCartLink) {
            headerCartLink.addEventListener('click', addClassToBody);
        }

        if (closeCartButton) {
            closeCartButton.addEventListener('click', removeClassFromBody);
        }

        document.addEventListener('click', clickremoveClassFromBody);

        checkButtonState();

        return () => {
            if (headerCartLink) {
                headerCartLink.removeEventListener('click', addClassToBody);
            }
            if (closeCartButton) {
                closeCartButton.removeEventListener('click', removeClassFromBody);
            }
  
            document.addEventListener('click', clickremoveClassFromBody);

            addToCartButtons.forEach(button => {
                const observer = new MutationObserver(() => {}); // Replace with actual cleanup
                observer.disconnect();
            });

        };
    }, []);

    return null;
};

export default CartScript;
