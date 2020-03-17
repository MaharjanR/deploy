import React from 'react';
import { Link } from 'react-router-dom';


export default (props) => {
    return(
        <div className="grid-33">
            <Link className="course--module course--link" to={`courses/${props.id}`} >
                <h4 className="course--label">Course</h4>
            <h3 className="course--title"> {props.title}</h3>
            </Link>    
        </div>
    )
}