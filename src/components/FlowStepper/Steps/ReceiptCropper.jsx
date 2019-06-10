import React from 'react';
import Button from '@material-ui/core/Button';
import { Store } from '../../../Store';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const calcRelativeDiff = (originalShape, actualShape) => {
  return {
    width: originalShape.width / actualShape.width,
    height: originalShape.height / actualShape.height,
  };
};

const getShapeFromSrc = src => {
  let tempImage = new Image();
  tempImage.src = src;
  const { width, height } = tempImage;
  return { width, height };
};

const isEmpty = obj =>
  Object.entries(obj).length === 0 && obj.constructor === Object;

const convertPointsArrayToRelativeCropObject = (
  originalImageShape,
  actualImageShape,
  pointsArr,
) => {
  if (pointsArr.length != 4) return null;

  const diff = calcRelativeDiff(originalImageShape, actualImageShape);
  const newCrop = Object.assign(
    {},
    { x: pointsArr[0][0] / diff.height },
    { y: pointsArr[0][1] / diff.width },
    { width: Math.abs(pointsArr[2][0] - pointsArr[3][0]) / diff.width },
    { height: Math.abs(pointsArr[2][1] - pointsArr[1][1]) / diff.height },
  );
  return { newCrop, diff };
};

function ReceiptCropper({ classes, backCallback, nextCallback, message }) {
  const { state, dispatch } = React.useContext(Store);
  const { loading, mlProposedCrop, src, errorMessage, cropperMessage, croppedPhoto, } = state;

  const [crop, setCrop] = React.useState({});
  const [croppersImageShape, setCroppersImageShape] = React.useState({ height: 0, width: 0 });
  const [doesImageFullyLoaded, setDoesImageFullyLoaded] = React.useState(false);
  const [proposedReady, setProposedReady] = React.useState(false);
  const [relativeDiff, setRelativeDiff] = React.useState(0);

  React.useEffect(() => {
    console.log("First time on ReceiptCropper, setting undo crop..");
  }, []);

  React.useEffect(() => {
    if (doesImageFullyLoaded && !isEmpty(mlProposedCrop)) {
      const relativeCrop = convertPointsArrayToRelativeCropObject(
        getShapeFromSrc(src),
        croppersImageShape,
        mlProposedCrop
      );
      setRelativeDiff(relativeCrop.diff);
      console.log('Calculated new relative crop :', relativeCrop);
      setCrop({
        ...relativeCrop.newCrop,
      });
      setProposedReady(true);
    }
  }, [mlProposedCrop, doesImageFullyLoaded]);

  React.useEffect(() => {
    console.log('The new crop is : ', crop);
  }, [crop]);

  const handleOnCropChange = newCrop => {
    console.log('crop changed...', newCrop);
    setCrop({ ...newCrop });
  };

  const handleOnCropComplete = (newCrop, pixelCrop) => {
    console.log('crop completed...', newCrop, pixelCrop);
    setCrop({ ...newCrop });
  };

  const handleOnImageLoaded = ({ height, width }) => {
    console.log('imageLoaded.......');
    if (height > 100) {
      setCroppersImageShape({ height, width });
      setDoesImageFullyLoaded(true);
    } else {
      console.log('image didnt fully loaded... h:', height, 'w:', width);
    }
  };

  const onStepDone = () => {
    // Handle situtation which the user come back here after cropped and pressed back to crop again..
    if (state.userEndedCropping) {
      nextCallback();
    }
    dispatch({
      type: 'NEW_CROP',
      actualCrop: crop,
      // TODO : Used to see if the send photo is good or nor.. can be seen after pressing next and then back
      // croppedPhoto:
      // 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
      diff: relativeDiff,
    });
  };

  const getCroppedImg = (srcImage, pixelCrop) => {
    let img = new Image();
    img.src = this.state.selectedImageURL;
    const targetX = (srcImage.width * pixelCrop.x) / 100;
    const targetY = (srcImage.height * pixelCrop.y) / 100;
    const targetWidth = (srcImage.width * pixelCrop.width) / 100;
    const targetHeight = (srcImage.height * pixelCrop.height) / 100;

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      img,
      targetX,
      targetY,
      targetWidth,
      targetHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );

    return canvas.toDataURL('image/jpeg');
  };

  return (
    <div>
      <p style={{ direction: 'rtl', marginLeft: '10%', marginRight: '10%' }}>
        {cropperMessage}
      </p>
      {src && (
        <ReactCrop
          src={src}
          crop={crop}
          onComplete={handleOnCropComplete}
          onChange={handleOnCropChange}
          onImageLoaded={handleOnImageLoaded}
        />
      )}
      <Button
        variant="outlined"
        onClick={backCallback}
        style={{ width: '20px' }}
        className={classes.backButton}
      >
        חזרה
      </Button>
      <Button
        // type="submit"
        variant="contained"
        style={{ width: '60px', marginRight: '10px' }}
        color="primary"
        className={classes.button}
        disabled={loading || errorMessage != ''}
        onClick={onStepDone}
      >
        הבא
      </Button>
    </div>
  );
}

export default ReceiptCropper;
