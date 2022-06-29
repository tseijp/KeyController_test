export function each(obj, fun, ctx) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) fun.call(ctx, obj[i], i);
  } else
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) fun.call(ctx, obj[key], key);
    }
}

export function makeQueue() {
  let next = new Set();
  let current = next;
  return {
    add: (fun) => void next.add(fun),
    delete: (fun) => void next.delete(fun),
    cancel: () => void (current = next = new Set()),
    flush() {
      if (current.size) {
        next = new Set();
        each(current, (fun) => fun() && next.add(fun));
        current = next;
      }
    }
  };
}

export function makeStore() {
  const map = new Map();
  return {
    add: (fun, key) => {
      const queue = map.get(key) || map.set(key, makeQueue()).get(key);
      queue.add(fun);
    },
    delete: (fun, key) => map.get(key)?.delete?.(fun),
    flush: (key, ...args) => map.get(key)?.flush?.(...args)
  };
}
