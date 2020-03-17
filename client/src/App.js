import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import Header from './components/Header';
import Public from './components/Public';
import CreateCourse from './components/CreateCourse';
import CourseDetail from './components/CourseDetail';
import Errors from './components/Error';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import UpdateCourse from './components/UpdateCourse';
import withContext from './Context';
import PrivateRoute from './PrivateRoute';
import Forbidden from './components/Forbidden';

const HeaderUpWithContext = withContext(Header);

const PublicWithContext = withContext(Public);
const DetailWithContext = withContext(CourseDetail);
const SignInWithContext = withContext(UserSignIn);
const SignUpWithContext = withContext(UserSignUp);
const SignOutWithContext = withContext(UserSignOut);
const UpdateWithContext = withContext(UpdateCourse);
const CreateWithContext = withContext(CreateCourse);

function App() {
  return (
    <Router>
      <React.Fragment>
        <HeaderUpWithContext />       
        <hr />
        <Switch>
          <Route exact path='/' component={PublicWithContext} />
          <Route path='/signin' component={SignInWithContext} />
          <Route path='/signup' component={SignUpWithContext} />
          <Route path='/signout' component={SignOutWithContext} />
          <Route path='/forbidden' component={Forbidden} />
          <PrivateRoute path='/courses/create' component={CreateWithContext} />
          <PrivateRoute path='/courses/:id/update' component={UpdateWithContext} />
          <Route path='/courses/:id' component={DetailWithContext} />
          <Route path='/delete/:id' component={DetailWithContext} />
          <Route path='/error' component={Errors} />
        </Switch>
      </React.Fragment>
    </Router>
  );
}

export default App;
