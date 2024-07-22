import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';
import submit_icon from '../../assets/submit_icon.png'; // Add your submit icon path

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allproducts')
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
      });
  };
  useEffect(() => {
    fetchInfo();
  }, []);

  const handleInputChange = (index, field, value) => {
    const newProducts = [...allproducts];
    newProducts[index][field] = value;
    setAllProducts(newProducts);
  };

  const submitChanges = async (product) => {
    await fetch('http://localhost:4000/modifyproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: product.id, old_price: product.old_price, new_price: product.new_price }),
    }).then(response => {
      if (response.ok) {
        alert('Product modified successfully!');
      } else {
        console.error('Failed to update the product');
      }
    }).catch(error => {
      console.error('Error updating product:', error);
    });
  };

  const removeProduct = async (id) => {
    await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    }).then(response => {
      if (response.ok) {
        fetchInfo();
        alert('Product removed successfully!');
      } else {
        console.error('Failed to remove the product');
      }
    }).catch(error => {
      console.error('Error removing product:', error);
    });
  };

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Actions</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <React.Fragment key={product.id}>
            <div className="listproduct-format-main listproduct-format">
              <img src={product.image} alt="" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <input
                type='text'
                value={product.old_price}
                onChange={(e) => handleInputChange(index, 'old_price', e.target.value)}
              />
              <input
                type='text'
                value={product.new_price}
                onChange={(e) => handleInputChange(index, 'new_price', e.target.value)}
              />
              <p>{product.category}</p>
              <div className="listproduct-action-icons">
                <img
                  onClick={() => submitChanges(product)}
                  className='listproduct-submit-icon'
                  src={submit_icon}
                  alt="Submit"
                />
                <img
                  onClick={() => removeProduct(product.id)}
                  className='listproduct-remove-icon'
                  src={cross_icon}
                  alt="Remove"
                />
              </div>
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
