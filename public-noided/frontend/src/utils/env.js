const dotenv = import.meta.env;

const env = new Proxy( dotenv, {

    get: (target, param) => {
        return target[param];
    }
});

export default env;