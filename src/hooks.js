import { useRef, useMemo, useState, useEffect } from "react";
import { each, makeStore } from "./helpers";

const _obj = (key, fun) => (typeof key === "string" ? { [key]: fun } : key);
const _arr = (arg) => (Array.isArray(arg) ? arg : [arg]);

export class Controller {
  constructor() {
    const store = makeStore();
    // const flush = (...args) => (p, k) => console.log(k, ...args, ..._arr(p));
    const flush = (...args) => (p, k) => store.flush(k, ...args, ..._arr(p));
    const state = (key, ...args) => each(_obj(key, []), flush(state, ...args));
    state.delete = (events) => each(events, store.delete);
    state.add = (events) => each(events, store.add);
    state.isInitialized = false;
    this.state = state;
  }

  effect() {
    const { state } = this;
    if (state.isInitialized) return false;
    return (state.isInitialized = true);
  }

  clean() {
    const { state } = this;
    if (state.isInitialized) return false;
    return !(state.isInitialized = false);
  }

  apply(props) {
    this.props = props;
    return this.state;
  }
}

export function useStore(state, ...args) {
  const ref = useMutable(_obj(...args));
  useEffect(() => void state.add(ref), [state, ref]);
  useEffect(() => () => state.delete(ref), [state, ref]);
  return state;
}

export function useCtrl(Proto, props) {
  const [ctrl] = useState(() => new Proto());
  useEffect(() => void ctrl.effect());
  useEffect(() => () => ctrl.clean(), [ctrl]);
  return ctrl.apply(props);
}

function useMutable(target = {}) {
  const ref = useRef();
  ref.current = target;
  return useMemo(() => {
    const memo = {};
    each(ref.current, (prop, key) => {
      memo[key] = (...args) => prop(...args);
    });
    return memo;
  }, []);
}
