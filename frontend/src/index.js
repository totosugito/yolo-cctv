import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './stores'
import {BrowserRouter} from "react-router-dom";
import {Toaster} from "react-hot-toast";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter future={{
    v7_relativeSplatPath: true,
    v7_startTransition: true,
  }}>
    <Provider store={store}>
      <App/>
      <Toaster/>
    </Provider>
  </BrowserRouter>
)
