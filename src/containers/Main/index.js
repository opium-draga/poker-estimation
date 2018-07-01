import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import LoginPage from "../LoginPage";
import TablePage from "../TablePage";


class Main extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={TablePage}/>
          <Route path='/login' component={LoginPage}/>
        </Switch>
      </main>
    );
  }
}

export default Main;
