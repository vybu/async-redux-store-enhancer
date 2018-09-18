# async-redux-store-enhancer

This is a dependency free redux store enhancer that adds ability to add additional reducers and middleware after the store has been created. There is no magic happening, just using existing redux functionality, check out the source code to learn how it works. 

## Usage examples

### Injecting a reducer and middleware

```js
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { asyncStoreCreator } from 'async-redux-store-enhancer'

// instead of passing a reducer to createStore, we pass a reducer factory
// where the only difference from normal reducer is that it takes an argument of new reducers and spreads it.
const createReducer = (newReducers = {}) => combineReducers({
  yourReducers,
  ...newReducers,
})

// this creates your usual redux store, that has 2 additional methods:
// injectReducer(reducerName, reducerFunction)
// injectMiddleware(middlewareFunction)
const store = asyncStoreCreator(createStore, applyMiddleware, compose)(createReducer, initialState, middleware);

store.injectReducer('newReducer', newReducerFunction); // that's it this adds new reducer, while preserving previous state
store.injectMiddleware(newMiddlewareFunction); // adding new middleware is as easy as this, this new middleware function will be called after all other are called
```

### Injecting middleware to be called before existing ones

```js
// you can pass 4th argument { prependNewMiddleware } to the store creator factory
const store = asyncStoreCreator(createStore, applyMiddleware, compose, { prependNewMiddleware: true })(createReducer, initialState, middleware);
```

### Using with redux dev tools

```js
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { asyncStoreCreator } from 'async-redux-store-enhancer'

// as per redux dev tools documentation
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = asyncStoreCreator(createStore, applyMiddleware, composeEnhancers)(createReducer);

```




