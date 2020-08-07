import { createStore } from 'redux';

const initialState = {
  sidebarShow: '',
  asideShow: false,
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
};

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest };
    default:
      return state;
  }
};

const store = createStore(changeState);
export default store;
