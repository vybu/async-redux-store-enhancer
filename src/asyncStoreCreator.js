// INSPIRED BY: https://tylergaw.com/articles/dynamic-redux-reducers/

const dynamicMiddlewareMiddleware = (middlewares) => () => (next) => (action) => {
  const nxt = middlewares.reduce(
    (prevMiddleware, nextMiddleware) => nextMiddleware(prevMiddleware),
    next,
  );
  return nxt(action);
};

export const asyncStoreCreator = (
  createStore,
  applyMiddleware,
  composeEnhancers,
  { prependNewMiddleware } = {},
) => (createReducer, initialState, middleware = []) => {
  const dynamicMiddlewares = [];
  let enhancer = composeEnhancers(
    prependNewMiddleware
      ? applyMiddleware(dynamicMiddlewareMiddleware(dynamicMiddlewares), ...middleware)
      : applyMiddleware(...middleware, dynamicMiddlewareMiddleware(dynamicMiddlewares)),
  );

  const store = createStore(createReducer(), initialState, enhancer);

  // Create an object for any later reducers
  store.asyncReducers = {};

  // Creates a convenient method for adding reducers later
  // See withReducer.js for this in use.
  store.injectReducer = (key, reducer) => {
    // Updates the aysncReducers object. This ensures we don't remove any old
    // reducers when adding new ones.
    store.asyncReducers[key] = reducer;
    // This is the key part: replaceReducer updates the reducer
    // See rootReducer.createReducer for more details, but it returns a function.
    store.replaceReducer(createReducer(store.asyncReducers));
    return store;
  };

  store.injectMiddleware = (middleware) => dynamicMiddlewares.push(middleware(store));

  return store;
};
