// src/App.js

import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Notifier from './components/Notifier';
import axios, { post } from 'axios';
import ReactCrop from 'react-image-crop';

class App2 extends Component {
  constructor() {
    super();
    this.state = {
      offline: false,
      photo: null,
      src: null,
      crop: {
        width: 200,
        x: 0,
        y: 0
      }
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.uploadPhoto = this.uploadPhoto.bind(this)
  }

  componentDidMount() {
    window.addEventListener('online', () => {
      this.setState({ offline: false });
    });

    window.addEventListener('offline', () => {
      this.setState({ offline: true });
    });
  }

  componentDidUpdate() {
    let offlineStatus = !navigator.onLine;
    if (this.state.offline !== offlineStatus) {
      this.setState({ offline: offlineStatus });
    }
  }

  onFormSubmit(e){
    console.log("onFormSubmit");
    e.preventDefault()
    this.uploadPhoto(this.state.photo).then((response)=>{
      console.log(response.data);
    })
  }

  onChange = e => {
    console.log("onChange");
    
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result})
      , );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  uploadPhoto(photo){
    const url = 'http://193.106.55.179:8888/isReceipt';
    const formData = new FormData();
    formData.append('photo',photo)
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            "Access-Control-Allow-Origin": "*",
        }
    }
    console.log("posting..");
    return post(url, formData,config)
  }

  onImageLoaded = (image, crop) => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  render() {
    const { crop, croppedImageUrl, src } = this.state;

    return (
      <div className="App">
        <Notifier offline={this.state.offline} />
        <img src={logo} className="App-logo" alt="Spleat Logo"/>
        <form onSubmit={this.onFormSubmit}>
          <input className="Upload" type="file" accept="image/*" onChange={this.onChange}/>
          <button type="submit">Upload</button>
        </form>
        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        {croppedImageUrl && (
          <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
        )}
      </div>
    );
  }
}

export default App2;