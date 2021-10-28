import React, { Component } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import katex from "katex";
import "katex/dist/katex.min.css";

class SunEditorEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email_content: "",
      mountedEditor: false,
      isRoleAdmin: false,
      isVisible: false,
      data: {},
      errors: {
        email_content: "",
      },
    };
    this.formats = [
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "list",
      "bullet",
      "align",
      "color",
      "background",
      "link",
    ];
  }
  /******************* 
  @Purpose : Used for get updated props
  @Parameter : nextprops
  @Author : INIC
  ******************/
  UNSAFE_componentWillReceiveProps(nextprops) {
    this.setState({
      data: Object.assign(this.state.data, {
        email_content: nextprops.editContenet,
      }),
    });
  }
  /******************* 
  @Purpose : Used for update with new contents
  @Parameter : newContent
  @Author : INIC
  ******************/
  updateContent(newContent) {
    this.setState({
      email_content: newContent,
    });
  }
  /******************* 
  @Purpose : Used for content data
  @Parameter : html
  @Author : INIC
  ******************/
  handleChange = (html) => {
    this.setState({
      data: Object.assign(this.state.data, {
        email_content: html,
      }),
    });
    this.props.getPreview(html);
  };
  /******************* 
  @Purpose : Used for render HTML in our components
  @Parameter : {}
  @Author : INIC
  ******************/
  render() {
    let { data } = this.state;
    return (
      <div>
        {data.email_content && (
          <SunEditor
            name="email_content"
            onChange={this.handleChange}
            setContents={data.email_content}
            placeholder={this.props.placeholder}
            setOptions={{
              katex: katex,
              height: 350,
              buttonList: [
                [
                  "undo",
                  "redo",
                  "bold",
                  "underline",
                  "italic",
                  "subscript",
                  "superscript",
                  "outdent",
                  "indent",
                  "textStyle",
                  "table",
                  "link",
                  "image",
                  "video",
                  "audio",
                  "fullScreen",
                  "showBlocks",
                  "codeView",
                  "preview",
                  "print",
                  "save",
                ],
              ],
              dialogBox: {
                linkBox: {
                  title: "Insert Link",
                  url: "URL to link",
                  text: "Text to display",
                },
                imageBox: {
                  title: "Insert image",
                  file: "Select from files",
                },
                videoBox: {
                  title: "Insert Video",
                  url: "Media embed URL, YouTube",
                },
              },
            }}
          />
        )}
      </div>
    );
  }
}

export default SunEditorEdit;
