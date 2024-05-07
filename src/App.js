import { useSelector, useDispatch } from 'react-redux';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import { useEffect } from 'react';
import { uiActons } from './store/ui-slice';
import Notification from './components/UI/Notification';

let isInitial = true;

function App() {

  const showCart = useSelector(state => state.ui.cartIsVisible);
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const notification = useSelector(state => state.ui.notification)

  useEffect(() => {
    const sendCartData = async() => {
      dispatch(uiActons.showNotification({
        status: 'pending',
        title: 'Sending..',
        message: 'Sending cart Data'
      })
    );
      const response = await fetch('https://advanced-redux-98735-default-rtdb.europe-west1.firebasedatabase.app/cart.json', 
      { method: 'PUT', 
      body: JSON.stringify(cart)
    });
    if (!response.ok){
     throw new Error('Sending cart data failed.')
    }

    dispatch(uiActons.showNotification({
      status: 'success',
      title: 'Success!',
      message: 'Sent cart data succesfully'
    })
  );
};

if(isInitial) {
  isInitial = false;
  return;
}
 sendCartData().catch(error => {
  dispatch(
    uiActons.showNotification({
      status: 'error',
      title: 'Error!',
      message: 'Sending cart data failed!',
    })
  )
 })
},[cart, dispatch]);

  return (
    <>
    {notification && 
    <Notification 
    status={notification.status}
    title={notification.title}
    message={notification.message}
    />}
    <Layout>
      {showCart && <Cart />}
      <Products />
    </Layout>
    </>
  );
}

export default App;
