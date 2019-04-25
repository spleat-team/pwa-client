import ReactDOM from "react-dom";
import React, { PureComponent } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import logo from './logo.png';
import './App.css';
import axios, { post } from 'axios';
import { css } from '@emotion/core';
import { SyncLoader } from 'react-spinners';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

class App extends PureComponent {
  
  constructor() {
    super();
    this.state = {
      loading: false,
      src: null,
      hasReceiptInPhoto: false,
      doesLoadedImage: false,
      receiptCoordinates: null,
      crop: {
        width: 200,
        x: 0,
        y: 0
      }
    };

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.sendPhoto = this.sendPhoto.bind(this)
  }

  componentDidUpdate() {
    if (this.state.hasReceiptInPhoto && !this.state.receiptCoordinates) {
      console.log("Searching for coordinates..")
      this.sendPhoto(this.state.photo, 'detectReceipt').then((response)=>{
        console.log("Found coordinates!!!", response.data)
        this.setState({
          receiptCoordinates: response.data,
          crop: {
            width: response.data[1][0] - response.data[0][0],
            height: response.data[1][1] - response.data[0][1],
            x: response.data[0][0],
            y: response.data[0][1]
          }
        });
      });
    }
  }

  onFormSubmit = e => {
    console.log("onFormSubmit", e, this.state);
    e.preventDefault()
  }

  sendPhoto = (photo, type) => {
    if (!type)
      return null;

    const url = `http://193.106.55.179:8888/${type}`;
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

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      this.setState({
        doesLoadedImage: true,
        loading: true,
      });
      const img = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(img);
      this.setState({photo: img, loading: true});
      this.sendPhoto(img, 'isReceipt').then((response)=>{
        this.setState({
          hasReceiptInPhoto: response.data == 1,
          loading: false
        });
      });
    }
  };

  onImageLoaded = (image, crop) => {
    this.imageRef = image;
    this.setState({loading: false})
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
    const { crop, croppedImageUrl, src, hasReceiptInPhoto, doesLoadedImage} = this.state;

    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="Spleat Logo"/>
        <div>
          <input type="file" onChange={this.onSelectFile} />
        </div>
        <p>{!doesLoadedImage ? 'Please upload the receipt first :)' :(hasReceiptInPhoto ? 'Yay!! looks like we have a receipt here..':'Sorry! receipt not found..')}</p>
        <div className='sweet-loading' style={{margin: 20}}>
        <SyncLoader
          css={override}
          sizeUnit={"px"}
          size={8}
          color={'#123abc'}
          loading={this.state.loading}
        />
      </div> 
        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        <form onSubmit={this.onFormSubmit}>
          <button type="submit">Finish!</button>
        </form>
      </div>
    );
  }
}

export default App;