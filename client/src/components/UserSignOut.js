import React from 'react';
import { Redirect } from 'react-router-dom';

export default ({context}) => {

    context.action.signOut();
    return <Redirect to="/" />;
}
  