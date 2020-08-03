import React, { Component } from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
    state = {
        orders: [],
        loading: true
    }
    componentDidMount () {
       this.props.onFetchedOrders();
    }
    render () {
        let orders = <Spinner />
        if(!this.props.loading) {
            orders = (
                this.props.orders.map(order => (
                    <Order 
                         key={order.id}
                         price={+order.Price}
                         ingredients={order.Ingredients}
                         />
                ))
            );
        }
        return (
            <div>
               {orders}
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchedOrders: () => dispatch(actions.fetchOrders())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));