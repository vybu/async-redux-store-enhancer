import { Action, Store, Reducer, DeepPartial, StoreEnhancer, AnyAction } from 'redux';

export interface EnhancedStore<S = any, A extends Action = AnyAction> extends Store<S, A> {
  /**
   * Injects a new reducer into current store, while preserving any existing state/reducers
   * @param reducerName name of reducer
   * @param reducer  reducer function
   */
  injectReducer(reducerName: string | number, reducer: Function): void;
  /**
   * Injects additional middleware to the store
   * @param middleware function
   */
  injectMiddleware(middleware: Function): void;
}

export interface EnhancedStoreCreator {
  <S, A extends Action, Ext, StateExt>(
    createReducer: (asyncReducers: any) => Reducer<S, A>,
    preloadedState?: DeepPartial<S>,
    enhancer?: StoreEnhancer<Ext>,
  ): EnhancedStore<S & StateExt, A>;
}

export interface Options {
  prependNewMiddleware: Boolean;
}

export interface AsyncStoreCreator {
  (createStore: Function, applyMiddleware: Function, compose: Function, options: Options): EnhancedStoreCreator;
}

export const asyncStoreCreator: AsyncStoreCreator;
