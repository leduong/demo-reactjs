import ENDPOINT from '../constants';

const getProducts = async () => await fetch(ENDPOINT).then(res => res.json()).then(data => console.log(data));
export { getProducts };
