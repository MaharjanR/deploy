import React, { Component } from 'react';
import Data from './Data';
import Cookies from 'js-cookie';

const Context = React.createContext();

export class Provider extends Component{

  constructor(){
    super();
    this.data = new Data();
  }
  
  state = {
    authenticatedUser:  Cookies.getJSON('authenticatedUser') || null
  };

  signIn = async (emailAddress, password) => {
    
    const user = await this.data.getUser( emailAddress, password);
  
    if(user !== null){
      user.password = password;
      this.setState( () => {
        return{
          authenticatedUser: user
        }
      });
      
      // set cookie
      Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
    }
    return user;
  }

  signOut = async () => {
    this.setState({
        authenticatedUser: null
      });
    Cookies.remove('authenticatedUser');
  }

  getId = path => {
    // getting the courses id only from the path 
    const id = path.match(/(\d+)/)[0];
    return id;
  }


  render(){
    const { authenticatedUser } = this.state  ;
    
    const value = {
      authenticatedUser,
      data: this.data,
      action: {
        signIn: this.signIn,
        signOut: this.signOut,
        getId: this.getId
      }
    };


    return(
      <Context.Provider value = {value}>
        {this.props.children}
      </Context.Provider>
    );
  }

}


export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}
