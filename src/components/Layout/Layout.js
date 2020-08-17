import React, { useState } from 'react';
import Auxiliary from '../../hoc/Auxiliary';
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';
import { connect } from 'react-redux';

const Layout = props => {
    // state = {
    //     showSideDrawer: false
    // };
    const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);

    const sideDrawerCloseHandler = () => {
        setSideDrawerIsVisible(false);
    }

    const sideDrawerToggleHandler = () => {
        setSideDrawerIsVisible(!sideDrawerIsVisible);
    }

        return (
            <Auxiliary>
                <Toolbar 
                    isAuth={props.isAuthenticated}
                    drawerToggleClicked={sideDrawerToggleHandler}/>
                <SideDrawer
                    isAuth={props.isAuthenticated} 
                    open={sideDrawerIsVisible}
                    closed={sideDrawerCloseHandler}/>
                <main className={classes.Content}>
                    {props.children}
                </main>
            </Auxiliary>
        );
}
const mapStateToProps = state => {
    return {
    isAuthenticated: state.auth.token !== null
    }; 
}

export default  connect(mapStateToProps)(Layout);