import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Typography } from '@mui/material';

interface ProductStockProps {
  productId: string;
}

const ProductStock: React.FC<ProductStockProps> = ({ productId }) => {
  const { products } = useAppContext();
  const product = products.find((p) => p._id === productId);

  if (!product) {
    return <Typography color="error">Product not found.</Typography>;
  }

  return (
    <Typography>Current Stock: {product.Stock}</Typography>
  );
};

export default ProductStock;