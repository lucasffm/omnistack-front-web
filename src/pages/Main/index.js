import React, { Component } from 'react';
import './styles.css';
import API from '../../services/api';
import logo from '../../assets/logo.svg';

export default class Main extends Component {
  state = {
    newBox: ''
  };

  handleSubmit = async e => {
    e.preventDefault();
    const response = await API.post('boxes', {
      title: this.state.newBox
    });
    const { _id } = response.data;
    this.props.history.push(`/box/${_id}`);
  };

  handleInputChange = e => {
    this.setState({
      newBox: e.target.value
    });
  };

  render() {
    return (
      <div id='main-container'>
        <form onSubmit={this.handleSubmit} action=''>
          <img src={logo} alt='' />
          <input
            value={this.state.newBox}
            onChange={this.handleInputChange}
            type='text'
            placeholder='Criar um box'
          />
          <button type='submit'>Criar</button>
        </form>
      </div>
    );
  }
}
