import React, { Component } from 'react';
import Layout from './components/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import CheckOut from './containers/CheckOut/CheckOut';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/logout/logout';
import * as actions from './store/actions/index';
import { connect } from 'react-redux';


class App extends Component {

  componentDidMount() {
    this.props.onTryAutoSignin();
  }
  render() {
    let routes = null;
    if(this.props.isAuthenticated){
      routes = (
        <Switch>
          <Route path="/checkout" component={CheckOut}/>
          <Route path="/orders" component={Orders} />
          <Route path="/logout" component={Logout} />
          <Route path="/" component={BurgerBuilder} />
          <Redirect to = "/" />
        </Switch>
      );
    }
    else {
      routes = (
          <Switch>
            <Route path="/auth" component={Auth} />
            <Route path="/" component={BurgerBuilder} />
            <Redirect to = "/" />
          </Switch>
      );
    }
      return (
        <div className="App">
        <Layout>
          {routes}
        </Layout>
        </div>
      );
  }
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
