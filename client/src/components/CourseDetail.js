import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class CourseDetail extends Component{

    state = {
        course: null
    };

    async componentDidMount(){
        const { context } = this.props;

        // path stores the uri of the link i.e. /courses/:id
        const path = this.props.location.pathname;
        // getting only the id from the path
        const id = context.action.getId(path);
        const course = await context.data.getCourse(`/courses/${id}`);
        
        this.setState({
            course
        });
    }

    deleteCourse = async () => {
        const { context } = this.props;
        const url = this.props.location.pathname;
        const username = context.authenticatedUser.emailAddress;
        const password = context.authenticatedUser.password;
        const { from } = this.props.location.state || { from: { pathname: '/' } };


        const deleteCourse = await context.data.deleteCourses(url, username, password);
        if(deleteCourse.length < 1){
            this.props.history.push(from);
        }
        else{
            this.props.history.push('/forbidden')
        }
    }

    render(){
        
        const {course} = this.state;
        const userEmail= this.props.context.authenticatedUser.emailAddress;
        let value;

        if(course){
            const { id, title, description, estimatedTime, materialsNeeded, firstName, lastName, emailAddress  } = course;
            value = (<div>
                        <div className="actions--bar">
                            <div className="bounds">
                                <div className="grid-100">
                                    { 
                                    (emailAddress === userEmail) && 
                                    <span>
                                        <Link className="button" to={`/courses/${id}/update`}>Update Course</Link>
                                        <button className="button" onClick={this.deleteCourse}>Delete Course</button>
                                    </span>
                                    }
                                    <Link className="button button-secondary" to="/">Return to List</Link>
                                </div>
                            </div>
                        </div>
                        <div className="bounds course--detail">
                            <div className="grid-66">
                                <div className="course--header">
                                    <h4 className="course--label">Course</h4>
                                    <h3 className="course--title">{ title }</h3>
                                    <p>By { firstName } { lastName }</p>
                                </div>
                                <div className="course--description">
                                    <p> { description } </p>
                                </div>
                            </div>
                            <div className="grid-25 grid-right">
                                <div className="course--stats">
                                    <ul className="course--stats--list">
                                        <li className="course--stats--list--item">
                                            <h4>Estimated Time</h4>
                                            <h3> { estimatedTime ? estimatedTime : <p>Unknown</p> } </h3>
                                        </li>
                                        <li className="course--stats--list--item">
                                            <h4>Materials Needed</h4>
                                            <ul>
                                                { (materialsNeeded) ?  <li>{ materialsNeeded }</li> : <li>None</li>}
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>)
        }
        else{
            value = (<div>Loading....</div>)
        }

        return(
            <React.Fragment>
                { value }
            </React.Fragment>
        )
    }
}