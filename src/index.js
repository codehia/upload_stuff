import React, { Component } from "react";
import ReactDOM from "react-dom";
// import {tus} from "tus"

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
// import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginImagePreview
);

const tus = require('tus-js-client')
// Component
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      // files: [
      //   {
      //     source: "photo.jpeg",
      //     options: {
      //       type: "local"
      //     }
      //   }
      // ]
    };
  }

  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

  render() {
    return (
      <div className="App">
        <FilePond
          ref={ref => (this.pond = ref)}
          files={this.state.files}
          allowMultiple={true}
          imageResizeTargetWidth="200"
          imageResizeTargetHeight="200"
          server={{
            process: (fieldName, files, metadata, load, error, progress, abort) => {
            var upload = new tus.Upload(files, {
            endpoint: "http://localhost:8001/upload",
            retryDelays: [0, 1000, 3000, 5000],
            // metadata: {
            //   filename: file.name,
            //   filetype: file.type
            // },
            onError: function(err) {
              console.log("Failed because: " + err)
              error(err)
            },
            onProgress: function(bytesUploaded, bytesTotal) {
              progress(true, bytesUploaded, bytesTotal)
            },
            onSuccess: function() {
              load(upload.url.split('/').pop())
            }
          })
          // Start the upload
          upload.start()
           return {
             abort: () => {
               upload.abort()
               abort()
             }
           }
         }
         }}
         
          oninit={() => this.handleInit()}
          onupdatefiles={fileItems => {
            // Set currently active file objects to this.state
            this.setState({
              files: fileItems.map(fileItem => fileItem.file)
            });
          }}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
