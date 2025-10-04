import { useCallback, useEffect, useReducer } from "react";
import { carReducer, initialCarState } from "@/reducers/car-reducer";
import { ShoppingCartService } from "@/features/shopping cart/service/shopping-cart.service"; // ajusta path si hace falta
import type { Product } from "@/features/cart-item/model/cart-item.model";

const GUEST_KEY = "chiru_guest_cart_v1";

type GuestItem = {
  productId: string;
  amount: number;
  price: number;
  product?: Product;
};

export function useShoppingCart() {
  const [state, dispatch] = useReducer(carReducer, initialCarState);

  // rehidratar guest desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(GUEST_KEY);
      if (!raw) return;
      const items: GuestItem[] = JSON.parse(raw);
      items.forEach((it) => {
        // dispatch por cada item para renderizar en UI
        // construimos objeto product mínimo para compatibilidad con reducer
        dispatch({ type: "ADD_CAR", payload: { item: (it.product as any) || { id: it.productId, name: "", price: it.price } }});
        // si quieres también mantener counts, considera acción específica
      });
    } catch (e) {
      console.error("Failed to rehydrate guest cart", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistGuest = useCallback((items: GuestItem[]) => {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  }, []);

  // agrega al carrito; si userId está presente usa API, sino localStorage (guest)
  const addToCart = useCallback(
    async (product: Product, amount = 1, userId?: number | string) => {
      if (!product) return;
      // Guest flow
      if (!userId) {
        try {
          const raw = localStorage.getItem(GUEST_KEY);
          const items: GuestItem[] = raw ? JSON.parse(raw) : [];
          const existing = items.find((i) => i.productId === product.id);
          if (existing) {
            existing.amount += amount;
          } else {
            items.push({ productId: product.id, amount, price: (product as any).price || 0, product });
          }
          persistGuest(items);
          // update UI via reducer (optimistic)
          dispatch({ type: "ADD_CAR", payload: { item: product } });
          return { guest: true, items };
        } catch (err) {
          console.error("Error persisting guest cart", err);
          throw err;
        }
      }

      // Authenticated flow -> call API
      try {
        // first try addToCart; service expects AddToCartRequest
        await ShoppingCartService.addToCart(Number(userId), {
          productId: String(product.id),
          amount,
          price: (product as any).price || 0,
        });
        // optimistic UI update
        dispatch({ type: "ADD_CAR", payload: { item: product } });
        return { guest: false };
      } catch (err: any) {
        // if cart doesn't exist, try create then add
        const msg = (err && err.message) || "";
        try {
          if (msg.includes("not found") || msg.includes("Cart")) {
            await ShoppingCartService.createCart(Number(userId));
            await ShoppingCartService.addToCart(Number(userId), {
              productId: String(product.id),
              amount,
              price: (product as any).price || 0,
            });
            dispatch({ type: "ADD_CAR", payload: { item: product } });
            return { created: true };
          }
        } catch (e) {
          console.error("Error creating/adding cart", e);
          throw e;
        }
        console.error("Add to cart error", err);
        throw err;
      }
    },
    [persistGuest]
  );

  // exponer funciones útiles (implementar más según necesidad)
  const clearGuest = useCallback(() => {
    localStorage.removeItem(GUEST_KEY);
  }, []);

  return {
    state,
    dispatch,
    addToCart,
    clearGuest,
  };
}