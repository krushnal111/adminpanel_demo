import React, { Component } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

class SunEditorAdd extends Component {
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
    return (
      <div>
        <SunEditor
          name="email_content"
          insertHTML={this.state.email_content}
          onChange={this.handleChange}
          setOptions={{
            buttonList: [
              [
                "undo",
                "redo",
                "font",
                "fontSize",
                "formatBlock",
                "paragraphStyle",
                "blockquote",
                "bold",
                "underline",
                "italic",
                "subscript",
                "superscript",
                "outdent",
                "indent",
                "align",
                "horizontalRule",
                "lineHeight",
                "table",
                "link",
                "image",
                "fullScreen",
                "showBlocks",
                "codeView",
                "preview",
                "print",
                "save",
              ],
            ],
            controller: ["remove", "resize100", "maxSize"],
            width: "100%",
            minHeight: "300px",
            height: "auto",
          }}
        />
      </div>
    );
  }
}

export default SunEditorAdd;
