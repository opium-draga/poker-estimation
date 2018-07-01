import React, {Component} from 'react';
import {Input, Button, Divider} from 'antd';

const Search = Input.Search;

class EnterGameForm extends Component {
  render() {
    return (
      <div>
        Hello, <b>{this.props.name}</b>, <br/>what do you want to do?
        <Divider dashed/>

        <Search
          placeholder="Enter table number"
          enterButton="Join!"
          size="large"
          onSearch={value => this.props.connect(value)}
        />

        <Divider dashed/>
        <Button onClick={this.props.create} type="primary" size='large'>
          Create poker table
        </Button>
      </div>
    );
  }
}

export default EnterGameForm;
