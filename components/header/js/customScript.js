"use client";
import { useEffect } from 'react';

const CustomScript = () => {
  useEffect(() => {
    const handleScroll = () => {
      const stickyInfo = document.getElementById('stick-header');
      if (window.scrollY > 100) {
        stickyInfo?.classList.add('sticky-visible');
      } else {
        stickyInfo?.classList.remove('sticky-visible');
      }
    };
    window.addEventListener('scroll', handleScroll);

    /* Header Padding top */

    const stickyHeader = document.getElementById('stick-header');
    const mainBody = document.querySelector('.main_body');

    function updatePadding() {
      if (stickyHeader && mainBody) {
        const headerHeight = stickyHeader.offsetHeight;
        mainBody.style.paddingTop = `${headerHeight}px`;
      }
    }
    updatePadding();
    window.addEventListener('resize', updatePadding);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
};

export default CustomScript;
