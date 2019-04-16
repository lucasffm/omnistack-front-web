import React, { Component } from 'react';
import { MdInsertDriveFile } from 'react-icons/md';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import socket from 'socket.io-client';
import Dropzone from 'react-dropzone';
import API from '../../services/api';
import './styles.css';
import logo from '../../assets/logo.svg';

export default class Box extends Component {
  state = {
    box: {}
  };

  async componentDidMount() {
    this.subscribeToNewFiles();
    const id = this.props.match.params.id;
    const response = await API.get(`boxes/${id}`);
    this.setState({
      box: response.data
    });
    console.log(this.state.box);
  }

  subscribeToNewFiles = () => {
    const id = this.props.match.params.id;
    const io = socket('https://omnistack-backlucas.herokuapp.com');
    io.emit('connectRoom', id);
    io.on('file', data => {
      this.setState({
        box: { ...this.state.box, files: [data, ...this.state.box.files] }
      });
    });
  };

  handleUpload = files => {
    files.forEach(file => {
      const id = this.props.match.params.id;
      const data = new FormData();
      data.append('file', file);
      API.post(`boxes/${id}/files`, data);
    });
  };

  render() {
    return (
      <div id='box-container'>
        <header>
          <img src={logo} alt='' />
          <h1>{this.state.box.title}</h1>
        </header>
        <Dropzone onDrop={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()} className='upload'>
                <input {...getInputProps()} />
                <p>Arraste ou clique aqui para carregar seus arquivos!!</p>
              </div>
            </section>
          )}
        </Dropzone>
        <ul>
          {this.state.box.files &&
            this.state.box.files.map(file => (
              <li key={file._id}>
                <a
                  href={file.url}
                  className='fileInfo'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <MdInsertDriveFile size={24} color='#A5CFFF' />
                  <strong>{file.title}</strong>
                </a>
                <span>
                  Há{' '}
                  {distanceInWords(file.createdAt, new Date(), { locale: pt })}
                </span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
