import React, { Component } from "react";
import SunEditor from "suneditor-react"; // Used for Editor design/functionlity
import "suneditor/dist/css/suneditor.min.css";

class BlogEditorAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blog_content: "",
      mountedEditor: false,
      isRoleAdmin: false,
      isVisible: false,
      data: {},
      errors: {
        blog_content: "",
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
        blog_content: nextprops.editContent,
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
      blog_content: newContent,
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
        blog_content: html,
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
          name="blog_content"
          insertHTML={this.state.blog_content}
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
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
                "list",
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
            width: "auto",
            maxWidth: "1100px",
            minWidth: "1100px",
            minHeight: "300px",
            height: "auto",
          }}
        />
      </div>
    );
  }
}
export default BlogEditorAdd;
