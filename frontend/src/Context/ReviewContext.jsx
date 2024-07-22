import React, { createContext, useState } from "react";

export const ReviewContext = createContext(null);

const ReviewContextProvider = (props) => {
    const [reviews, setReviews] = useState([]);

    const fetchReviews = async (productId) => {
        try {
            const response = await fetch(`http://localhost:4000/reviews/${productId}`);
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const addReview = async (productId, rating, comment) => {
        try {
            const response = await fetch(`http://localhost:4000/addReview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`
                },
                body: JSON.stringify({ productId, rating, comment })
            });
            const data = await response.json();
            setReviews((prev) => [...prev, data]);
        } catch (error) {
            console.error("Error adding review:", error);
        }
    };

    const modifyReview = async (productId, rating, comment) => {
        try {
            const response = await fetch(`http://localhost:4000/modifyReview`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`
                },
                body: JSON.stringify({ productId, rating, comment })
            });
            const data = await response.json();
            setReviews((prev) => prev.map((review) => review._id === data._id ? data : review));
        } catch (error) {
            console.error("Error modifying review:", error);
        }
    };

    const deleteReview = async (productId) => {
        try {
            await fetch(`http://localhost:4000/deleteReview`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`
                },
                body: JSON.stringify({ productId })
            });
            setReviews((prev) => prev.filter((review) => review.productId !== productId));
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const contextValue = { reviews, fetchReviews, addReview, modifyReview, deleteReview };

    return (
        <ReviewContext.Provider value={contextValue}>
            {props.children}
        </ReviewContext.Provider>
    );
};

export default ReviewContextProvider;
