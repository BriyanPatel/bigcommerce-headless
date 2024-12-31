"use client";

import React, { useState, memo, useRef } from "react";
import { FaStar, FaRegStar } from 'react-icons/fa';
import ReCAPTCHA from "react-google-recaptcha";
import { addWriteReviewData } from '../../../../../../components/product-form/_actions/write-review'; // Import the mutation
import { toast } from 'react-hot-toast';

// Define types for improved type safety
interface ProductReviewProps {
  slug: string;
  product: {
    id: number;
    name: string;
  };
}

interface FormErrors {
  rating: string;
  name: string;
  email: string;
  recaptcha: string;
}

export const ProductReview: React.FC<ProductReviewProps> = memo(({ product, customerId }) => {
  // State management for form
  const [showWriteReviewPopup, setShowWriteReviewPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    rating: '',
    name: '',
    email: '',
    recaptcha: ''
  });

  // Ref for reCAPTCHA
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Validate email function
  const validateEmail = (emailValue: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Partial<FormErrors> = {};

    if (!rating) {
      errors.rating = 'Please select a rating';
    }
    if (!name.trim()) {
      errors.name = 'Please enter your name';
    }
    if (!email.trim()) {
      errors.email = 'Please enter your email';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Verify reCAPTCHA
    const recaptchaToken = recaptchaRef.current?.getValue();
    if (!recaptchaToken) {
      errors.recaptcha = 'Please complete the reCAPTCHA';
    }

    // Update errors
    setFormErrors(prevErrors => ({
      ...prevErrors,
      ...errors
    }));

    // Return whether form is valid
    return Object.keys(errors).length === 0;
  };

  // Handle review submission
  const handleSubmitReview = async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    // Validate form
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare review input
      const reviewInput = {
        rating: parseInt(rating.toString(), 10),
        author: name.trim(),
        email: email.trim(),
        title: subject.trim(),
        text: comments.trim(),
      };

      // Get reCAPTCHA token
      const reCaptchaToken = recaptchaRef.current?.getValue() || '';

      // Submit review
    let response = await addWriteReviewData({
        input: reviewInput,
        productEntityId: product.entityId,
        customerId,
        reCaptchaToken
      });
      
      if (response?.errors[0]?.message) {
        toast.error(response?.errors[0]?.message);
        return;
      }

  
      toast.success("Review submitted successfully!");

      resetForm();
    } catch (error) {
    
      toast.error('Review submission error');
      
    } finally {
      setIsSubmitting(false);
      // Always reset reCAPTCHA
      recaptchaRef.current?.reset();
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setShowWriteReviewPopup(false);
    setRating(0);
    setName('');
    setEmail('');
    setSubject('');
    setComments('');
    setFormErrors({
      rating: '',
      name: '',
      email: '',
      recaptcha: ''
    });
  };

  // Render star rating
  const renderStarRating = () => {
    return Array(5)
      .fill(null)
      .map((_, i) => (
        <span
          key={i}
          className={`text-3xl cursor-pointer ${
            i < rating ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={() => setRating(i + 1)}
        >
          {i < rating ? <FaStar /> : <FaRegStar />}
        </span>
      ));
  };

  return (
    <>
      <button 
        className="text-black hover:text-[#b80d0d]" 
        onClick={() => setShowWriteReviewPopup(true)}
      >
        Write a Review
      </button>
      
      {/* Rest of the component remains the same as in the previous implementation */}
      {showWriteReviewPopup && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-[99] bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm"></div>
          
          {/* Popup Container */}
          <div className="fixed inset-0 z-[99] flex items-center justify-center">
            <div className="relative w-full max-w-xl mx-4 bg-white rounded-lg shadow-lg md:mx-0">
              {/* Close Button */}
              <button
                className="absolute text-gray-500 top-4 right-4 hover:text-gray-700"
                onClick={() => setShowWriteReviewPopup(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Form Content */}
              <div className="px-8 py-6">
                <h2 className="mb-4 text-3xl font-bold text-center">
                  Write a Review
                </h2>
                
                <form>
                  {/* Rating Selection */}
                  <div className="mb-4">
                    <label className="block mb-2 font-bold" htmlFor="rating">
                      Rating
                    </label>
                    <div className="flex items-center justify-start mb-2">
                      {renderStarRating()}
                    </div>
                    {formErrors.rating && (
                      <p className="text-red-500">{formErrors.rating}</p>
                    )}
                  </div>
                  
                  {/* Name Input */}
                  <div className="mb-4">
                    <label className="block mb-2 font-bold" htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                    {formErrors.name && (
                      <p className="text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  
                  {/* Email Input */}
                  <div className="mb-4">
                    <label className="block mb-2 font-bold" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                    {formErrors.email && (
                      <p className="text-red-500">{formErrors.email}</p>
                    )}
                  </div>
                  
                  {/* Review Subject */}
                  <div className="mb-4">
                    <label className="block mb-2 font-bold" htmlFor="subject">
                      Review Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-3 py-2 border border-gray-400 rounded-md"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Summarize your review"
                    />
                  </div>
                  
                  {/* Comments Textarea */}
                  <div className="mb-4">
                    <label className="block mb-2 font-bold" htmlFor="comments">
                      Comments
                    </label>
                    <textarea
                      id="comments"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Share your detailed review"
                    ></textarea>
                  </div>
                  
                  {/* reCAPTCHA */}
                  <div className="mb-4">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6LcjX0sbAAAAACp92-MNpx66FT4pbIWh-FTDmkkz"
                      onChange={() => {
                        // Clear any previous reCAPTCHA errors
                        setFormErrors(prev => ({
                          ...prev,
                          recaptcha: ''
                        }));
                      }}
                    />
                    {formErrors.recaptcha && (
                      <p className="text-red-500 mt-2">{formErrors.recaptcha}</p>
                    )}
                  </div>
                  
                  {/* Submit and Cancel Buttons */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="primary-btn mr-4"
                      onClick={handleSubmitReview}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => setShowWriteReviewPopup(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
});

export default ProductReview;