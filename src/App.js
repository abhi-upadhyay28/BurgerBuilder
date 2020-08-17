import React, { useEffect, Suspense } from 'react';
import Layout from './components/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
//import CheckOut from './containers/CheckOut/CheckOut';
//import Orders from './containers/Orders/Orders';
//import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/logout/logout';
import * as actions from './store/actions/index';
import { connect } from 'react-redux';

const Checkout = React.lazy (() => {
  return import('./containers/CheckOut/CheckOut');
});

const Orders = React.lazy (() => {
  return import('./containers/Orders/Orders');
});

const Auth = React.lazy (() => {
  return import('./containers/Auth/Auth');
});


const App = props => {

    useEffect(() => {
      props.onTryAutoSignin();
    }, []);

    let routes = null;
    if(props.isAuthenticated){
      routes = (
        <Switch>
          <Route path="/checkout" render={(props) => <Checkout {...props}/>}/>
          <Route path="/orders" render={(props) => <Orders {...props}/>} />
          <Route path="/logout" component={Logout} />
          <Route path="/auth" render={(props) => <Auth {...props}/>} />
          <Route path="/" component={BurgerBuilder} />
          <Redirect to = "/" />
        </Switch>
      );
    }
    else {
      routes = (
          <Switch>
            <Route path="/auth" render={(props) => <Auth {...props}/>} />
            <Route path="/" component={BurgerBuilder} />
            <Redirect to = "/" />
          </Switch>
      );
    }
      return (
        <div className="App">
        <Layout>
        <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense> 
        </Layout>
        </div>
      );
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null 
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignin: () => dispatch(actions.authCheckState())
  };
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
