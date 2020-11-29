# react-locustjs-locator
This library provides a small utility Render function that provides dependency injection for react components using [locustjs-locator](https://github.com/ironcodev/locustjs-locator).


## Step 1. Define Component dependencies
Define dependences of a React component (either class component or functional component) in a 'dependencies' object for the component itself.

./Components/Users.jsx
```javascript
// Class Component
import React from 'react';
import { UserServiceBase } from '../Services/Users';

class Users extends React.Component {
   constructor() {
    super();
    
    this.state = {
      users: []
    }
   }
   async componentDidMount() {
      const { userService } = this.props;
      const users = await userService.getAll();
      
      this.setState({ users });
   }
   render() {
    return <ul>
      {this.state.users.map(user => <li key={user.id}>
        First Name: {user.first_name}, Last Name: {user.last_name}
      </li>)
    </ul>
   }
}

Users.dependencies = {
   userService: UserServiceBase
}

export default Users;
```

./Components/User.jsx
```javascript
// Function Component
import React, { useState, useEffect } from 'react';
import { UserServiceBase } from '../Services/Users';

const User = props => {
   const [user, setUser] = useState(null);
   
   useEffect(() => {
        (async () => {
            const { userService, id } = props;
            const user = await userService.fetch(id);
            
            setUser(user);

        })();
    });

    return (user ?
        <React.Fragment>
            <h2>User.Id: {props.id}</h2>
            <div>
                <b>First Name: </b>
                <span>{user.first_name}</span>
            </div>
            <div>
                <b>Last Name: </b>
                <span>{user.last_name}</span>
            </div>
        </React.Fragment>
        : <b>Not Found</b>)
}

User.dependencies = {
   userService: UserServiceBase
}

export default User;
```

./Services/Users/index.js
```javascript
import { API_ROOT } from '../../Constants';

class UserServiceBase {
  getAll() { throw 'UserService.getAll() is not implemented' }
  getById(id) { throw 'UserService.getAll() is not implemented' }
}

class UserServiceRemote extends UserServiceBase {
  async getAll() {
    const response = await fetch(`${API_ROOT}/users`);
    const result = await response.json();
    
    return result;
  }
  async getById(id) {
    const response = await fetch(`${API_ROOT}/users/${id}`);
    const result = await response.json();
    
    return result;
  }
}

class UserServiceFake extends UserServiceBase {
  constructor() {
    super();
    
    this._users = [
      { id: 1, first_name: 'John', last_name: 'Doe' },
      { id: 2, first_name: 'Michael', last_name: 'Brown' }
    ]
  }
  getAll() {
    return new Promise(res => res(this._users));
  }
  getById(id) {
    return new Promise(res => res(this._users.find(u => u.id === id)));
  }
}

export { UserServiceBase, UserServiceRemote, UserServiceFake }
```

./Constants.js
```javascript
const API_ROOT = '/api';

export {
  API_ROOT
}
```

./locator.config.js
```javascript
import Locator from 'locustjs-locator';
import { UserServiceBase, UserServiceRemote, UserServiceFake } from './Services/Users';

const function configureLocator(remote) {
  if (remote) {
    Locator.Instance.register(UserServiceBase, UserServiceRemote);
  } else {
    Locator.Instance.register(UserServiceBase, UserServiceFake);
  }
}

export default configureLocator;
```

## Step 2. Render cmponents
Use 'Render' in order to render a component. The component to be rendered must be specified as the first property.

./index.js
```javascript
import ReactDOM from 'react-dom';
import Render from 'react-locustjs-locator';
import Users from './Components/Users';
import User from './Components/User';
import configureLocator from './locator.config.js';

configureLocator(false);

ReactDOM.render(<div>
    <Render Users={Users} />
    <Render User={User} id={2} />
  </div>, document.getElementById('root'));
```


