import React, { Component } from 'react';
import Form from './Form';

export default class CreateCourse extends Component {

    state = {
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        errors: ''
    }

    handleChange = (event) => {
        const { value } = event.target;
        const { name } = event.target;


        this.setState({
            [name]: value
        });
    }

    onSubmit = async () => {
        const { context } = this.props;
        const { title, description, estimatedTime, materialsNeeded } = this.state;
        const { emailAddress, password, id } = context.authenticatedUser;
        const { from } = this.props.location.state || { from: { pathname: '/' } };

        const credential = { 
            'username': emailAddress,
            'password': password
        }

        const courses = {
            'title': title,
            'description': description,
            'estimatedTime': estimatedTime,
            'materialsNeeded': materialsNeeded,
            'userId': id
        }
        const addCourse = await context.data.createCourses(courses, credential);


        if(addCourse.length === 0){
            console.log('Courses has been added successfully');
            this.props.history.push(from);
        }
        else{
            this.setState({
                errors: addCourse
            });
        }
    }

    render(){
        const { authenticatedUser } = this.props.context;
        const name = `${authenticatedUser.firstName} ${authenticatedUser.lastName}`;
        const { title, description, estimatedTime, materialsNeeded, errors} = this.state;
        return(
            <div className="bounds course--detail">
                <h1>Create Course</h1>
                <div>
                    <Form 
                        cancel={this.onCancel}
                        errors={ errors }
                        submit={this.onSubmit}
                        submitButtonText='Add Course'
                        elements={ () => (
                            <React.Fragment>
                                <div className="grid-66">
                                    <div className="course--header">
                                        <h4 className="course--label">Course</h4>
                                        <div>
                                            <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." value={title} onChange={this.handleChange } />
                                        </div>
                                        <p>By { name }</p>
                                    </div>
                                    <div className="course--description">
                                        <div><textarea id="description" name="description" className="" placeholder="Course description..." value={description} onChange={ this.handleChange } /></div>
                                    </div>
                                </div>
                                <div className="grid-25 grid-right">
                                    <div className="course--stats">
                                        <ul className="course--stats--list">
                                            <li className="course--stats--list--item">
                                                <h4>Estimated Time</h4>
                                                <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" value={estimatedTime} onChange={ this.handleChange } /></div>
                                            </li>
                                            <li className="course--stats--list--item">
                                                <h4>Materials Needed</h4>
                                                <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." value={materialsNeeded} onChange={ this.handleChange } /></div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </React.Fragment>
                    )} />
                       
                </div>
            </div>
        )
    }
}