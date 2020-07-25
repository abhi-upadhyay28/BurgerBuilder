import React from 'react';
import Layout from './components/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import {Route, Switch} from 'react-router-dom';
import CheckOut from './containers/CheckOut/CheckOut';
import Orders from './containers/Orders/Orders';
function App() {
  return (
    <div className="App">
    <Layout>
      <Switch>
      <Route path="/checkout" component={CheckOut}/>
      <Route path="/orders" component={Orders} />
      <Route path="/" component={BurgerBuilder} />
      </Switch>
    </Layout>
    </div>
  );
}

export default App;
