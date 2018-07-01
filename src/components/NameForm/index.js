import React, {Component} from 'react';
import {Input} from 'antd';

const Search = Input.Search;

class NameForm extends Component {
  render() {
    return (
        <Search
          placeholder="What is your name?"
          enterButton="Let go!"
          size="large"
          onSearch={value => this.props.setName(value)}
        />
    );
  }
}

export default NameForm;
