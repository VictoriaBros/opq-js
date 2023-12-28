const pipeline = (...fns) => (val) => fns.reduce((prev, fn) => fn(prev), val);

export {
    pipeline,
};
