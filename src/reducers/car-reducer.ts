import type { Product } from "@/features/product/models/product.model";

export type CarActions =
  | { type: "ADD_CAR"; payload: { item: Product } }
  | { type: "REMOVE_FROM_CAR"; payload: { item: Product["id"] } }
  | { type: "DECREMENT_CAR_COUNT"; payload: { item: Product["id"] } }
  | { type: "INCREMENT_CAR_COUNT"; payload: { item: Product["id"] } }
  | { type: "CLEAR_CAR" };

export type CarState = {
  data: Product[];
  cars: { product: Product; count: number }[];
};

export const initialCarState: CarState = {
  data: [],
  cars: [],
};

export const carReducer = (state: CarState, action: CarActions): CarState => {
  switch (action.type) {
    case "ADD_CAR": {
      const { item } = action.payload;
      const existingCar = state.cars.find((car) => car.product.id === item.id);
      if (existingCar) {
        return {
          ...state,
          cars: state.cars.map((car) =>
            car.product.id === item.id ? { ...car, count: car.count + 1 } : car,
          ),
        };
      }
      return {
        ...state,
        cars: [...state.cars, { product: item, count: 1 }],
      };
    }
    /*
    case "REMOVE_FROM_CAR": {
      const { item } = action.payload;
      return {
        ...state,
        cars: state.cars.filter((car) => car.product.id !== item.id),
      };
    }
    case "DECREMENT_CAR_COUNT": {
      const { item } = action.payload;
      const existingCar = state.cars.find((car) => car.product.id === item.id);
      if (existingCar) {
        if (existingCar.count === 1) {
          return {
            ...state,
            cars: state.cars.filter((car) => car.product.id !== item.id),
          };
        }
        return {
          ...state,
          cars: state.cars.map((car) =>
            car.product.id === item.id ? { ...car, count: car.count - 1 } : car,
          ),
        };
      }
      return state;
    }
    case "INCREMENT_CAR_COUNT": {
      const { item } = action.payload;
      return {
        ...state,
        cars: state.cars.map((car) =>
          car.product.id === item.id ? { ...car, count: car.count + 1 } : car,
        ),
      };
    }
    case "CLEAR_CAR": {
      return initialCarState;
    }*/
    default:
      return state;
  }
};

// Example usage:
// dispatch({ type: 'ADD_CAR', payload: { item: product } });
// dispatch({ type: 'REMOVE_FROM_CAR', payload: { item: productId } });
// dispatch({ type: 'DECREMENT_CAR_COUNT', payload: { item: productId } });
// dispatch({ type: 'INCREMENT_CAR_COUNT', payload: { item: productId } });
// dispatch({ type: 'CLEAR_CAR' });
