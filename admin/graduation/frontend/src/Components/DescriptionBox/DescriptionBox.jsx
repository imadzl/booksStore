import React from 'react'
import './DescriptionBox.css'
import Reviews from '../Review/Reviews'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews (122)</div>
        </div>
        <div className="descriptionbox-description">
          <p>An e-commerce website is an online platform that makes it easy for 
            buying and selling products or services over the Internet. It 
            serves as a virtual marketplace where companies and individuals can 
            showcase their products, interact with customers, and carry out 
            transactions without the need for a physical presence. 
            E-commerce websites have gained immense popularity due to their convenience, 
            accessibility and global reach that they offer.</p>
          <p>
            E-commerce websites typically display products or services along with 
            detailed descriptions, images, prices, and any available variations. 
            Each product usually has its own dedicated page 
            with relevant information.
            </p>
        </div>
    </div>
  )
}

export default DescriptionBox