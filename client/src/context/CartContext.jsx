import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // 1. Check local storage first! If it exists, parse it. If not, start empty.
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("swiftcart_items");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  // 2. Automatically save the cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("swiftcart_items", JSON.stringify(cartItems));
  }, [cartItems]); // This array tells React to only run this when 'cart' updates

  // New UI State to control the sliding drawer
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1, icon: "📦" }];
    });
    // Auto-open the drawer when they add something!
    setIsCartOpen(true);
  };

  // Move the update quantity logic here so the drawer can use it
  const updateQuantity = (id, change) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity + change) };
        }
        return item;
      }),
    );
  };

  const removeProduct = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 1. ADD THIS CRITICAL FUNCTION for your Checkout page!
  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        cartCount,
        cartSubtotal,
        updateQuantity,
        removeProduct,
        clearCart, // 2. Add it to the exported values!
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 3. ADD THIS MAGICAL COMMENT to silence the Fast Refresh warning!
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
