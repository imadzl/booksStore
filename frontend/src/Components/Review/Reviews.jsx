import React, { useContext, useEffect, useState } from "react";
import { ReviewContext } from "../../Context/ReviewContext";
import { useParams } from "react-router-dom";
import './Reviews.css'
import user_icon from '../Assets/user_icon.png';

const Reviews = () => {
    const { productId } = useParams();
    const { reviews, fetchReviews, addReview } = useContext(ReviewContext);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const isAuthenticated = localStorage.getItem('auth-token') !== null;

    const stars_count = 5;
    const star_icon = "★"
    const uns_color = "grey";
    const def_color = "#FF4141";
    const [tempRating, setTempRating] = useState(0);

    let stars = Array(stars_count).fill(star_icon);

    const displayDate = (Date) => {
        let year = Date.slice(0,4);
        let month = Date.slice(5,7);
        let day = Date.slice(8,10);
        let time = Date.slice(11,16);
        return time + " - " + day + "/" + month + "/" + year;
    };

    useEffect(() => {
        fetchReviews(productId);
    }, [productId, fetchReviews]);

    const handleAddReview = () => {
        addReview(productId, rating, comment);
        setRating(0);
        setComment("");
    };

    return (
        <div className="reviews">
            <h2>Reviews</h2>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review._id} className="review">
                        <div className="UserPhoto">
                        <img src={user_icon} alt="" />
                        <p>{review.username}</p>
                        </div>
                        <div className="total-stars-view">
                        {stars.map((item, index)=>{
                            const isActiveColor = (review.rating) && (index < review.rating);

                            let elementColor ='';

                            if (isActiveColor) {
                                elementColor = "#FF4141";
                            } else {
                                elementColor = "grey";
                            }

                            return (
                                <div key={index}
                                style={{color: elementColor}}
                                >
                                    {"★"}
                                </div>
                            );
                        })}
                        </div>
                        <p>{review.comment}</p>
                        <p>Reviewed at: {displayDate(review.date)}</p>
                    </div>
                ))
            ) : (
                <p>No reviews yet.</p>
            )}
            {isAuthenticated && (
                <>
                <div className="add-review">
                    <h3>Add a Review</h3>
                    <div className="starsContainer">
                        {stars.map((item, index)=>{
                            const isActiveColor = (rating || tempRating) && (index < rating || index < tempRating);

                            let elementColor ='';

                            if (isActiveColor) {
                                elementColor = def_color;
                            } else {
                                elementColor = uns_color;
                            }

                            return (
                                <div className="star"
                                key={index}
                                style={{color: elementColor}}
                                onMouseEnter={()=>setTempRating(index + 1)}
                                onMouseLeave={()=>setTempRating(0)}
                                onClick={()=>setRating(index+1)}
                                >
                                    {star_icon}
                                </div>
                            );
                        })}
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Comment"
                    />
                    <button className="add-review-btn" onClick={handleAddReview}>Add Review</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Reviews;
