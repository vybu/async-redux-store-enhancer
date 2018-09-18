import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { asyncStoreCreator } from '../asyncStoreCreator';

const testReducer = () => ({
  testState: 1,
});

const createTestReducer = (asyncReducers = {}) =>
  combineReducers({
    testReducer,
    ...asyncReducers,
  });

const createTestMiddleware = (spy) => (store) => (next) => (action) => {
  spy(action);
  next(action);
};

describe('asyncStoreCreator', () => {
  it('creates redux store', () => {
    const store = asyncStoreCreator(createStore, applyMiddleware, compose)(createTestReducer);
    expect(store.getState()).toEqual({ testReducer: testReducer() });
  });

  it('adds ability to inject new reducer to the store', () => {
    const newReducer = () => ({ newReducerState: 2 });
    const store = asyncStoreCreator(createStore, applyMiddleware, compose)(createTestReducer);
    store.injectReducer('newReducer', newReducer);
    expect(store.getState()).toEqual({ testReducer: testReducer(), newReducer: newReducer() });
  });

  it('allows you to inject new middleware before other middlewares', () => {
    const callStack = [];
    const initialMiddlewareSpy = () => callStack.push(1);
    const newMiddlewareSpy = () => callStack.push(2);
    const store = asyncStoreCreator(
      createStore,
      applyMiddleware,
      compose,
    )(createTestReducer, undefined, [ createTestMiddleware(initialMiddlewareSpy) ]);
    store.injectMiddleware(createTestMiddleware(newMiddlewareSpy));
    store.dispatch({ type: 'Test' });
    expect(callStack).toEqual([ 1, 2 ]);
  });

  it('allows you to inject new middleware after other middlewares', () => {
    const callStack = [];
    const initialMiddlewareSpy = () => callStack.push(1);
    const newMiddlewareSpy = () => callStack.push(2);
    const store = asyncStoreCreator(createStore, applyMiddleware, compose, {
      prependNewMiddleware: true,
    })(createTestReducer, undefined, [ createTestMiddleware(initialMiddlewareSpy) ]);
    store.injectMiddleware(createTestMiddleware(newMiddlewareSpy));
    store.dispatch({ type: 'Test' });
    expect(callStack).toEqual([ 2, 1 ]);
  });
});
