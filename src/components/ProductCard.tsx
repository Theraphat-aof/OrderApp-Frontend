'use client';

import { useState } from 'react';
import { ShoppingCart, X, Edit, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/providers/AuthProvider';
import { useDeleteProduct } from '@/hooks/useProducts';
import { CartItem } from '@/providers/CartProvider';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  active: boolean;
}

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
}

export function ProductCard({ product, onEdit }: ProductCardProps) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const deleteProduct = useDeleteProduct();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct.mutateAsync(product.id);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleAddToCart = () => {
    if (quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (quantity > product.stock) {
      setError(`Only ${product.stock} items available in stock`);
      return;
    }

    // Animation Logic
    const imgElement = document.getElementById(`product-img-${product.id}`) as HTMLImageElement;
    // Try to find the cart icon
    const cartDesktop = document.getElementById('cart-icon-desktop');
    const cartMobile = document.getElementById('cart-icon-mobile');
    
    // Choose available target
    const target = (cartMobile && cartMobile.offsetParent) ? cartMobile : cartDesktop;

    if (imgElement && target) {
      const imgRect = imgElement.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const flyingImg = imgElement.cloneNode(true) as HTMLImageElement;
      flyingImg.style.position = 'fixed';
      flyingImg.style.left = `${imgRect.left}px`;
      flyingImg.style.top = `${imgRect.top}px`;
      flyingImg.style.width = `${imgRect.width}px`;
      flyingImg.style.height = `${imgRect.height}px`;
      flyingImg.style.opacity = '0.9';
      flyingImg.style.zIndex = '9999';
      flyingImg.style.pointerEvents = 'none';
      flyingImg.style.borderRadius = '0.5rem';
      flyingImg.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      flyingImg.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';

      document.body.appendChild(flyingImg);

      // Trigger animation
      requestAnimationFrame(() => {
        flyingImg.style.left = `${targetRect.left + (targetRect.width/4)}px`;
        flyingImg.style.top = `${targetRect.top + (targetRect.height/4)}px`;
        flyingImg.style.width = '20px';
        flyingImg.style.height = '20px';
        flyingImg.style.borderRadius = '50%';
        flyingImg.style.opacity = '0.5';
      });

      // Cleanup
      setTimeout(() => {
        flyingImg.remove();
      }, 800);
    }

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity,
      image: product.image,
      stock: product.stock,
    };

    addItem(cartItem);
    setIsAdded(true);
    setError('');
    setQuantity(1);

    // Reset "Added" state after 2 seconds
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setQuantity(Math.max(1, value));
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      {/* Image Section */}
      <div className="relative w-full h-38 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            id={`product-img-${product.id}`}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-4xl">📦</div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
          {product.category}
        </div>

        {/* Stock Status */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4">
        {/* Admin Controls */}
        {(user as any)?.role === 'admin' && (
          <div className="flex gap-2 mb-3 pb-3 border-b">
            <button
              onClick={() => onEdit?.(product)}
              className="flex-1 flex items-center justify-center gap-1 bg-yellow-100 text-yellow-700 py-1 rounded text-sm hover:bg-yellow-200 transition-colors"
            >
              <Edit size={14} /> Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
              className="flex-1 flex items-center justify-center gap-1 bg-red-100 text-red-700 py-1 rounded text-sm hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}

        {/* Title & Price */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600">
            {product.description}
          </p>
        </div>

        {/* Price & Stock */}
        <div className="flex justify-between items-center mb-3 mt-auto">
          <span className="text-2xl font-bold text-blue-600">
            ฿{Number(product.price).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`text-xs font-medium ${
            isOutOfStock ? 'text-red-600' : 'text-green-600'
          }`}>
            {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs flex items-start gap-2">
            <span className="mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Add to Cart Section */}
        {!isOutOfStock && (
          <div className="space-y-2">
            {/* Quantity Input */}
            <div className="flex items-center gap-2">
              <label htmlFor={`qty-${product.id}`} className="text-sm font-medium text-gray-700">
                Qty:
              </label>
              <input
                id={`qty-${product.id}`}
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
              />
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <X size={18} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
