import React, { useContext, useState } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from "../Components/Item/Item";

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [sortOrder, setSortOrder] = useState('original');
  const [search, setSearch] = useState('');
  console.log(search)

  // Sorting function
  const sortProducts = (products, order) => {
    const sortedProducts = [...products]; // Create a copy before sorting
    if (order === 'asc') {
      sortedProducts.sort((a, b) => a.new_price - b.new_price);
    } else if (order === 'desc') {
      sortedProducts.sort((a, b) => b.new_price - a.new_price);
    }
    return sortedProducts;
  };

  // Filter products based on category
  const filteredProducts = all_product.filter(item => item.category === props.category);

  // Sort filtered products based on sortOrder
  const filteredAndSortedProducts = sortOrder === 'original'
    ? filteredProducts
    : sortProducts(filteredProducts, sortOrder);

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-{filteredAndSortedProducts.length}</span> out of {filteredAndSortedProducts.length} products
        </p>
        <input 
              type="text" 
              placeholder="🔍 Search" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
        <div className="shopcategory-sort">
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
            <option value="original">Original Order</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
          <img src={dropdown_icon} alt="" />
        </div>
      </div>
      <div className="shopcategory-products">
        {filteredAndSortedProducts.filter((item) => {
          return search.toLocaleLowerCase() === '' ? item : item.name.toLocaleLowerCase().includes(search);
        }).map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  );
};

export default ShopCategory;
