import React, { useContext } from 'react'
import './Checkout.css'
import { ShopContext } from '../../Context/ShopContext'
import { Link } from 'react-router-dom'

const Checkout = () => {

    const {getTotalCartAmount,all_product,cartItems,EmptyCart} = useContext(ShopContext);

  return (
    <div className='checkout'>
        <div className='checkout-main'>
        <h1> Thank you for your purchase! </h1>
        <h2> Your order is : </h2>
        </div>
        <div className='checkout-products'>
        {all_product.map((e)=>{
            if(cartItems[e.id]>0)
            {
                return <div>
                <div className="checkout-format">
                    <img src={e.image} alt="" className='checkout-product-icon'/>
                    <p>{e.name}</p>
                    <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                    <p>₺{e.new_price*cartItems[e.id]}</p>
                </div>
                <hr />
            </div>
            }
            return null;
        })}
            <div className="checkout-bottom">
                <div className="checkout-total">
                    <h3>Total : ₺{getTotalCartAmount()}</h3>
                </div>
                <button onClick={()=>{EmptyCart()}}><Link style={{textDecoration: 'none', color: 'inherit'}} to='/'>Done</Link></button>
            </div>
        </div>    
    </div>
  )
}

export default Checkout