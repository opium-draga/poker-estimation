import React, {Component} from 'react';
import {Card} from 'antd';
import {Redirect} from 'react-router-dom';
import UserService from "../../services/UserService";
import EnterGameForm from "../../components/EnterGameForm";
import NameForm from "../../components/NameForm";


class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.userService = new UserService();

    this.state = Object.assign({
      name: null,
      tableId: null,
      redirectToHome: false
    }, this.userService.getUser());

    this.userService.cleanUp();

    this.userService.observer.subscribe('tableInit', () => {
      setTimeout(() => {
        this.setState({redirectToHome: true});
      })
    });
  }

  setName = (name) => {
    this.setState({name});
    this.userService.setProps({name});
  };

  create = () => {
    this.userService.createTable();
  };

  connect = (tableId) => {
    this.userService.joinTable(tableId)
  };

  render() {
    if (this.state.redirectToHome) {
      return <Redirect to='/'/>;
    }

    return (
      <Card style={{width: 300, textAlign: 'center'}}>
        {this.state.name
          ? (<EnterGameForm name={this.state.name} create={this.create} connect={this.connect}/>)
          : (<NameForm setName={this.setName}/>)
        }
      </Card>
    );
  }
}

export default LoginPage;
