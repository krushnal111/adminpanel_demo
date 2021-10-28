import React, { Component , Fragment} from "react";
import ReactCrop from "react-image-crop";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "react-image-crop/dist/ReactCrop.css";
import API from "../../api/Routes";
import { callApi } from "../../api"; // Used for api call
import { showMessageNotification } from "./../../utils/Functions"; //Utility functions
import Modal from "react-modal";
import {ADMIN_URL,AUTH_URL} from "../../config"

/******************* 
@Purpose : Used for custome modal desgin
@Author : INIC
******************/
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

class CropImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      crop: {
        unit: "%",
        width: 30,
        aspect: 16 / 9,
      },
      open: false,
      isUploading: false,
    };
  }
  /******************* 
  @Purpose : Used for open modal
  @Parameter : {}
  @Author : INIC
  ******************/
  openModel = () => {
    this.setState({ open: true });
  };
  /******************* 
  @Purpose : Used for close modal
  @Parameter : {}
  @Author : INIC
  ******************/
  closeLoginModal = () => {
    this.setState({ open: false, src: null });
  };
  /******************* 
  @Purpose : Used convert base64 to blob data
  @Parameter : b64Data, contentType, sliceSize
  @Author : INIC
  ******************/
  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }
  /******************* 
  @Purpose : Used for file upload
  @Parameter : {}
  @Author : INIC
  ******************/
  fileUploadSubmit = async () => {
    this.setState({ isUploading: true });
    let formData = new FormData();
    let ImageURL = this.state.b64Img;
    let block = ImageURL.split(";");
    let contentType = block[0].split(":")[1];
    let realData = block[1].split(",")[1];
    let blob = this.b64toBlob(realData, contentType);
    formData.append("file", blob);
    try {
      const response = await this.props.callApi(
        API.FILE_UPLOAD,
        formData,
        "post",
        null,
        true,
        true,
        ADMIN_URL
      );
      this.setState({ isUploading: false });
      if (response.status === 1) {
        showMessageNotification(response.message, 'success')
        this.props.getPreview(response.data.filePath);
        this.setState({ open: false, src: null });
      }
    } catch (error) {
      this.setState({ isUploading: false });
      showMessageNotification(error, 'error')
      throw error;
    }
  };
  /******************* 
  @Purpose : Used for file selection
  @Parameter : e
  @Author : INIC
  ******************/
  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
      this.setState({ open: true });
    }
  };
  /******************* 
  @Purpose : Used for image load
  @Parameter : image
  @Author : INIC
  ******************/
  onImageLoaded = (image) => {
    this.imageRef = image;
  };
  /******************* 
  @Purpose : Used for action perform after crop image 
  @Parameter : crop
  @Author : INIC
  ******************/
  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };
  /******************* 
  @Purpose : Used for change crop image
  @Parameter : crop
  @Author : INIC
  ******************/
  onCropChange = (crop) => {
    this.setState({ crop });
  };
  /******************* 
  @Purpose : Used for default image crop
  @Parameter : crop
  @Author : INIC
  ******************/
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
  /******************* 
  @Purpose : Used for get croped images
  @Parameter : image, crop, fileName
  @Author : INIC
  ******************/
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
      canvas.toBlob((blob) => {
        if (!blob) {
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = canvas.toDataURL("image/jpeg");
        let item_image = this.fileUrl.replace(
          /^data:image\/(png|jpg);base64,/,
          ""
        );
        this.setState({ b64Img: item_image });
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }
  /******************* 
  @Purpose : Used for render HTML in our components
  @Parameter : {}
  @Author : INIC
  ******************/
  render() {
    let { crop, src, open, isUploading } = this.state;
    return (
      <Fragment>
        <Modal
          isOpen={open}
          onRequestClose={() => this.closeLoginModal()}
          style={customStyles}
          contentLabel="Example Modal"
        >
          {src && (
            <div>
              <i onClick={() => this.setState({ src: "", open: false })} />
              <ReactCrop
                className="reactcrop"
                src={src}
                crop={crop}
                ruleOfThirds
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
              />
              <div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={this.fileUploadSubmit}
                >
                  {" "}
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          )}
        </Modal>
        <div id="addDiv">
          <label htmlfor="attach-file">
            <input
              type="file"
              name="image"
              id="file"
              accept="image/*"
              data-title="Drag and drop a file"
              onChange={this.onSelectFile}
            />
            <span
              id="addPicture"
              style={{ display: "block" }}
              className="add-user"
            >
              Upload pictures
            </span>
          </label>
        </div>
      </Fragment>
    );
  }
}
/******************* 
@Purpose : Used for get data from redux
@Parameter : state
@Author : INIC
******************/
const mapStateToProps = (state) => ({
  language: state.admin.language,
  admindata: state.admin.adminData,
  editadminprofile: state.admin.editAdminProfileData,
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { callApi })(withRouter(CropImages));
