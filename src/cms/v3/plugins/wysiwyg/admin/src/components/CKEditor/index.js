import React from "react";
import PropTypes from "prop-types";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "../ckeditor5-build-custom";
import styled from "styled-components";
const Wrapper = styled.div`
  .ck-dropdown .ck-button.ck-dropdown__button .ck-button__label {
    width: 6em;
  }
  .ck-editor__main > div {
    min-height: 200px;
  }
  .ck-content {
    font-size: 16px;
  }
  .ck-content h3 {
    font-size: 20px;
    margin: 0 0 24px 0;
  }
  .ck-content h4 {
    margin: 0 0 24px 0;
  }
  .ck-content blockquote {
    color: #003366;
    font-style: normal;
    font-size: 20px;
    border-left: solid 3px #fcba19;
  }
  .ck-content ul {
    list-style-type: disc;
  }
  .ck-content blockquote.callout-box {
    background-color: #d9eaf7;
    font-weight: 700;
    border-radius: 4px;
    border-left: none;
    padding: 12px 20px;
  }
  .ck-content img {
    max-width: 100%;
  }
  .ck-content .bcp-landing-intro__image {
    min-height: 300px;
    background-position: center;
  }
  .ck-content .legacy-link {
    background-color: #ffff00;
  }
  .ck-content ol li.lower-alpha {
    list-style-type: lower-alpha;
  }
`;

const configuration = {
  toolbar: [
    "heading",
    "style",
    "|",
    "bold",
    "italic",
    "underline",
    "link",
    "bulletedList",
    "numberedList",
    "|",
    "horizontalLine",
    "blockQuote",
    "insertTable",
    "mediaEmbed",
    "|",
    "removeFormat",
    "sourceEditing",
  ],
  image: {
    toolbar: [
      "linkImage",
      "imageStyle:inline",
      "imageStyle:block",
      "imageStyle:side",
      "|",
      "toggleImageCaption",
      "imageTextAlternative",
    ],
  },
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableCellProperties",
    ],
  },
  link: {
    decorators: {
      openInNewTab: {
        mode: "manual",
        label: "Open in a new tab",
        defaultValue: false,
        attributes: {
          target: "_blank",
          rel: "noopener",
        },
      },
    },
  },
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
      {
        model: "heading4",
        view: "h4",
        title: "Heading 4",
        class: "ck-heading_heading4",
      },
    ],
  },
  style: {
    definitions: [
      {
        name: "Callout box",
        element: "blockquote",
        classes: ["callout-box"],
      },
      {
        name: "Primary button",
        element: "a",
        classes: ["btn", "btn-primary"],
      },
      {
        name: "Legacy link",
        element: "a",
        classes: ["legacy-link"],
      },
      {
        name: "Lettered list",
        element: "li",
        classes: ["lower-alpha"],
      },
    ],
  },
  mediaEmbed: {
    previewsInData: true,
  },
  htmlSupport: {
    allow: [
      {
        name: /.*/,
        attributes: true,
        classes: true,
        styles: true,
      },
    ],
  },
};

const Editor = ({ onChange, name, value }) => {
  return (
    <Wrapper>
      <CKEditor
        editor={ClassicEditor}
        config={configuration}
        data={value}
        onReady={(editor) => {
          if (value) {
            editor.setData(value);
          }
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange({ target: { name, value: data } });
        }}
        onError={(error, { willEditorRestart }) => {
          if (willEditorRestart) {
            this.editor.ui.view.toolbar.element.remove();
          }
        }}
      />
    </Wrapper>
  );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default Editor;
