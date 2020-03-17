import config from './config';

export default class Data {
  
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if(requiresAuth){
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);

      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  async getCourses() {
    const response = await this.api(`/courses`, 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  async getCourse(id) {
    const response = await this.api(id, 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  async updateCourses(url, course, credentials){

    
    console.log(url);
    console.log(course);
    console.log(credentials);


    const response = await this.api(url, 'PUT', course, true, credentials);
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.message;
      });
    }
    else {
      throw new Error();
    }
  }

  async createCourses(course, credentials){

    console.log(course);
    console.log(credentials);
    const response = await this.api('/courses', 'POST', course, true, credentials);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.message;
      });
    }
    else {
      throw new Error();
    }
  }

  async deleteCourses(url, username, password){

    const response = await this.api(url, 'DELETE', null, true, { username, password });
    console.log(response);
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 403) {
      return response.json().then(data => {
        return data.message;
      });
    }
    else {
      throw new Error();
    }
  }

  async getUser(username, password) {
    const response = await this.api(`/users`, 'GET', null, true, { username, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }
  
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.message;
      });
    }
    else {
      throw new Error();
    }
  }
}
