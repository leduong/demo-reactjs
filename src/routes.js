import React from 'react';

const HomePage = React.lazy(() => import('./views/home'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/home', name: 'Home Page', component: HomePage },
];

export default routes;
