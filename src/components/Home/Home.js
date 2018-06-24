import React, {Component} from 'react';
import UserService from "../../services/UserService";
import {Redirect} from "react-router-dom";
import Table from "./Table";
import Cards from "./Cards";
import '../../css/home.css';
import {Button} from "antd";

class Home extends Component {
  constructor(props) {
    super(props);

    this.userService = new UserService();
    let user = this.userService.getUser();
    this.state = {
      user,
      redirectToLogin: !user.tableId,
      users: [],
      estimation: null
    };

    if (!this.state.user.tableId) {
      console.warn("You don't have table id, model:", this.state.user);
    }

    this.userService.observer.subscribe('stateUpdate', tableUsers => {
      let usersArr = [];
      Object.keys(tableUsers).forEach((uid) => {
        tableUsers[uid].current = uid === user.uid;
        usersArr.push(tableUsers[uid]);
      });

      this.setState({users: usersArr});
    });

    this.userService.observer.subscribe('estimationReady', estimation => {
      console.log("Estimation result", estimation);
      this.setState({estimation});
    });

    this.userService.observer.subscribe('reEstimation', () => {
      this.setState({estimation: null});
    });
  }

  selectCard = (card) => {
    let currUser = this.userService.getUser();
    if (currUser.selectedCard === card) {
      card = null;
    }

    this.userService.setProps({selectedCard: card});
    this.userService.updateUser();
    this.setState({user: this.userService.getUser()});
    console.log("Set card ", card);
  };

  estimate = () => {
    let notReady = 0;
    this.state.users.forEach(user => {
      if (!user.selectedCard) {
        notReady++;
      }
    });

    if (notReady) {
      alert(`There is ${notReady} unready players!`);
    } else {
      this.userService.estimate();
    }
  };

  reEstimate = () => {
    this.setState({
      estimation: null
    });
    this.userService.reEstimate();
  };

  render() {
    if (this.state.redirectToLogin) {
      return <Redirect to='/login'/>;
    }

    return (
      <div className="home">
        <div>
          <b>{this.state.user.name}</b>, table ID: <b>{this.state.user.tableId}</b>
          {this.state.user.master ?
            this.state.estimation ? <Button type="danger" onClick={this.reEstimate} style={{marginLeft: '10px'}}>Finish!</Button>
              : <Button onClick={this.estimate} style={{marginLeft: '10px'}}>Estimate!</Button> : ""}

        </div>

        <Table estimation={this.state.estimation} tableUsers={this.state.users}/>

        <Cards selectedCard={this.state.user.selectedCard} onSelect={this.selectCard}/>

      </div>
    );
  }
}

export default Home;
