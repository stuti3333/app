import { createContext } from 'react';
import { useReducer } from 'react';
export const Store = createContext();
const initialState = {
  cart: {
    items: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};
function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      const newItem = action.payload;
      const existItem = state.cart.items.find(
        (item) => item._id === newItem._id,
      );
      const items = existItem
        ? state.cart.items.map((item) =>
            item._id === existItem._id ? newItem : item,
          )
        : [...state.cart.items, newItem];
      localStorage.setItem('cartItems', JSON.stringify(items));
      return { ...state, cart: { ...state.cart, items } };
    case 'CART_REMOVE_ITEM':
      const updatedItems = state.cart.items.filter(
        (item) => item._id !== action.payload._id,
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          items: updatedItems,
        },
      };
    default:
      return state;
  }
}
export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
