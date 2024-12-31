"use client";
import { useEffect } from 'react';

const CustomScript = () => {
  useEffect(() => {
    // Define the progress function here
    const progress = () => {
      const grandTotalElem = document.querySelector('.cart-total-grandTotal span');
      const progressBox = document.querySelector('.progress-box');
      const percentElem = document.querySelector('.percent');
      const barElem = document.querySelector('.bar');
      const thresholdTextElem = document.querySelector('.threshold-text');
      
      if (!grandTotalElem) return; // Early exit if the element is not found
      
      let grandTotal = parseFloat(grandTotalElem.textContent.replace("$", ""));
      let amountLeft = 99.00 - grandTotal;
      let amountLeftDecimal = amountLeft.toFixed(2);
      let percent = Math.min((100 * grandTotal) / 99, 100).toFixed(2) + '%'; // Ensure percent doesn't exceed 100%
      if(progressBox){
        if (amountLeftDecimal > "00") {
          progressBox.classList.remove('threshold-reached');
          percentElem.textContent = percent;
          barElem.style.width = percent;
          thresholdTextElem.innerHTML = `You are only <span class="amount-left">$${amountLeftDecimal}</span> away from getting a <span style="color:#83B993;">free delivery!</span>`;
          if (grandTotal < 10) {
            barElem.classList.add('less');
          } else {
            barElem.classList.remove('less');
          }
        } else {
          progressBox.classList.add('threshold-reached');
          barElem.style.width = '100%';
          percentElem.textContent = '100%';
          thresholdTextElem.textContent = 'Congrats! You are eligible for the free delivery!';
        }
      }
      

    };

    // Initialize progress
    progress();

    // Timer functionality
    let timer2 = "10:01";
    const urgencyTextSpan = document.querySelector('.urgency-text span');
    
    const interval = setInterval(() => {
      let [minutes, seconds] = timer2.split(':').map(Number);
      seconds--; 
      if (seconds < 0) {
        seconds = 59;
        minutes--;
      }

      if (seconds < 10) seconds = '0' + seconds;
      if (minutes < 10 && minutes >= 0) minutes = '0' + minutes;

      if (urgencyTextSpan) {
        urgencyTextSpan.textContent = `${minutes}:${seconds}s`;       
      }

      if (minutes < 0 || (minutes === 0 && seconds === 0)) {
        clearInterval(interval);
      }

      timer2 = `${minutes}:${seconds}`;
      
    }, 1000);

    // Add event listeners for popup boxes
  function addClickListener(selector, popupSelector) {
    const element = document.querySelector(selector);
    if (element) {
      element.addEventListener("click", function () {
        const popup = document.querySelector(popupSelector);
        if (popup) {
          popup.style.display = "block";
        }
      });
    }
  }
  addClickListener(".return-box", ".returns-popup");
  addClickListener(".warranty-box", ".warranty-popup");
  addClickListener(".verified-box", ".verified-popup");

    document.querySelectorAll(".popup-box .close").forEach(function (closeButton) {
      closeButton.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelectorAll(".popup-box").forEach(function (popupBox) {
          popupBox.style.display = "none";
        });
        return false;
      });
    });

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  return null;
};

export default CustomScript;
