"use client";
import { useEffect } from 'react';

const CustomScript = () => {
  useEffect(() => {
    const handleScroll = () => {
      const stickyInfo = document.getElementById('stick-pr-info');
      if (window.scrollY > 50) {
        stickyInfo?.classList.add('sticky-visible');
      } else {
        stickyInfo?.classList.remove('sticky-visible');
      }
    };
    const handleOpenModal = () => {
      const modalForm = document.getElementById('open-pr-model-form');
      modalForm?.classList.add('open-modal');
      document.body.classList.add('open-modal');
    };
    const handleCloseModal = () => {
      const modalForm = document.getElementById('open-pr-model-form');
      modalForm?.classList.remove('open-modal');
      document.body.classList.remove('open-modal');
    };
    window.addEventListener('scroll', handleScroll);
    const openModalButton = document.querySelector('.open-pr-model');
    const closeModalButton = document.getElementById('modal-close');
    openModalButton?.addEventListener('click', handleOpenModal);
    closeModalButton?.addEventListener('click', handleCloseModal);

    setTimeout(function() {
    const faqElement = document.getElementById('tab-faq');

    if (!faqElement) {
        const faqDataElements = document.querySelectorAll('[data-title="tab-faq"]');
        if (faqDataElements.length > 0) {
            faqDataElements.forEach(element => {
                element.style.display = 'none';
            });
        } 
    }
    }, 1000);

    /* Review tab JS */

    function updateActiveTab() {
      const hash = window.location.hash;
      const tabLinks = document.querySelectorAll('.tab-review a');
      const tabli = document.querySelectorAll('ul.tabs_wrapper li');
      tabLinks.forEach(link => {
          const parentLi = link.parentElement;
          if (link.getAttribute('href') === hash) {
              tabli.forEach(li => li.classList.remove('is-active'));
              parentLi.classList.add('is-active');
          } else {
              parentLi.classList.remove('is-active');
          }
      });
    }
    
    updateActiveTab();
    window.addEventListener('hashchange', updateActiveTab);

    /* Tabs JS */

    const handleTabClick = (event) => {

      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('is-active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('is-active'));

      const clickedHref = event.currentTarget.getAttribute('href');
      document.querySelectorAll(`a[href="${clickedHref}"]`).forEach(link => {
        link.parentElement.classList.add('is-active');
      });
      const targetId = clickedHref.substring(1);
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('is-active');
      }


    };
    const tabs = document.querySelectorAll('.tabs_wrapper .tab a');
    tabs.forEach(tab => {
      tab.addEventListener('click', handleTabClick);
    });
    if (tabs.length > 0) {
      tabs[0].click();
    }


    

    return () => {
      window.removeEventListener('scroll', handleScroll);
      openModalButton?.removeEventListener('click', handleOpenModal);
      closeModalButton?.removeEventListener('click', handleCloseModal);
      tabs.forEach(tab => tab.removeEventListener('click', handleTabClick));
    };
  }, []);

  return null;
};

export default CustomScript;
