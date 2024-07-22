import React, { useContext } from 'react';
import './ProductDisplay.css';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);

    let stars = Array(5).fill("★");

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                </div>
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={product.image} alt="" />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-stars">
                {stars.map((item, index)=>{
                            const isActiveColor = (product.averageRating) && (index < product.averageRating);

                            let elementColor ='';

                            if (isActiveColor) {
                                elementColor = "#FF4141";
                            } else {
                                elementColor = "grey";
                            }

                            return (
                                <div className="total-stars"
                                key={index}
                                style={{color: elementColor}}
                                >
                                    {"★"}
                                </div>
                            );
                        })}
                    <p>({product.ratingsCount})</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">₺{product.old_price}</div>
                    <div className="productdisplay-right-price-new">₺{product.new_price}</div>
                </div>
                <div className="productdisplay-right-description">
                    {product.description}
                </div>
                <button onClick={() => { addToCart(product.id) }}>Add to Cart</button>
                <p className='productdisplay-right-category'><span>Category :</span>{product.category}</p>
            </div>
        </div>
    );
}

export default ProductDisplay;
