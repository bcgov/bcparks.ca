import ckeditor5Dll from "ckeditor5/build/ckeditor5-dll.js";
import ckeditor5AlignmentDll from "@ckeditor/ckeditor5-alignment/build/alignment.js";
import ckeditor5AutoformatDll from "@ckeditor/ckeditor5-autoformat/build/autoformat.js";
import ckeditor5AutosaveDll from "@ckeditor/ckeditor5-autosave/build/autosave.js";
import ckeditor5BasicStylesDll from "@ckeditor/ckeditor5-basic-styles/build/basic-styles.js";
import ckeditor5BlockQuoteDll from "@ckeditor/ckeditor5-block-quote/build/block-quote.js";
import ckeditor5CodeBlockDll from "@ckeditor/ckeditor5-code-block/build/code-block.js";
import ckeditor5EssentialsDll from "@ckeditor/ckeditor5-essentials/build/essentials.js";
import ckeditor5HeadingDll from "@ckeditor/ckeditor5-heading/build/heading.js";
import ckeditor5HtmlEmbedDll from "@ckeditor/ckeditor5-html-embed/build/html-embed.js";
import ckeditor5HtmlSupportDll from "@ckeditor/ckeditor5-html-support/build/html-support.js";
import ckeditor5HorizontalLineDll from "@ckeditor/ckeditor5-horizontal-line/build/horizontal-line.js";
import ckeditor5MediaEmbedDll from "@ckeditor/ckeditor5-media-embed/build/media-embed.js";
import ckeditor5ImageDll from "@ckeditor/ckeditor5-image/build/image.js";
import ckeditor5IndentDll from "@ckeditor/ckeditor5-indent/build/indent.js";
import ckeditor5LinkDll from "@ckeditor/ckeditor5-link/build/link.js";
import ckeditor5ListDll from "@ckeditor/ckeditor5-list/build/list.js";
import ckeditor5PasteFromOfficeDll from "@ckeditor/ckeditor5-paste-from-office/build/paste-from-office.js";
import ckeditor5RemoveFormatDll from "@ckeditor/ckeditor5-remove-format/build/remove-format.js";
import ckeditor5TableDll from "@ckeditor/ckeditor5-table/build/table.js";
import ckeditor5WordCountDll from "@ckeditor/ckeditor5-word-count/build/word-count.js";
import ckeditor5FindAndReplaceDll from "@ckeditor/ckeditor5-find-and-replace/build/find-and-replace.js";
import ckeditor5SpecialCharactersDll from "@ckeditor/ckeditor5-special-characters/build/special-characters.js";
import ckeditor5PageBreakDll from "@ckeditor/ckeditor5-page-break/build/page-break.js";
import ckeditor5SourceEditingDll from "@ckeditor/ckeditor5-source-editing/build/source-editing.js";
import ckeditor5LanguageDll from "@ckeditor/ckeditor5-language/build/language.js";
import ckeditor5HighlightDll from "@ckeditor/ckeditor5-highlight/build/highlight.js";
import ckeditor5StyleDll from "@ckeditor/ckeditor5-style/build/style.js";
import ckeditor5MentionDll from "@ckeditor/ckeditor5-mention/build/mention.js";
import ckeditor5FontWithPickerDll from "@_sh/ckeditor5-font-with-picker/build/font-with-picker.js";

import sanitizeHtml from "sanitize-html";

import * as strapiPlugins from '../plugins'
window.CKEditor5.strapiPlugins = strapiPlugins;

const w = {
  Alignment: window.CKEditor5.alignment.Alignment,
  Autoformat: window.CKEditor5.autoformat.Autoformat,
  AutoImage: window.CKEditor5.image.AutoImage,
  AutoLink: window.CKEditor5.link.AutoLink,
  Autosave: window.CKEditor5.autosave.Autosave,
  BalloonToolbar: window.CKEditor5.ui.BalloonToolbar,
  BlockQuote: window.CKEditor5.blockQuote.BlockQuote,
  BlockToolbar: window.CKEditor5.ui.BlockToolbar,
  Bold: window.CKEditor5.basicStyles.Bold,
  Code: window.CKEditor5.basicStyles.Code,
  CodeBlock: window.CKEditor5.codeBlock.CodeBlock,
  DataFilter: window.CKEditor5.htmlSupport.DataFilter,
  DataSchema: window.CKEditor5.htmlSupport.DataSchema,
  DocumentList: window.CKEditor5.list.DocumentList,
  DocumentListProperties: window.CKEditor5.list.DocumentListProperties,
  Essentials: window.CKEditor5.essentials.Essentials,
  FindAndReplace: window.CKEditor5.findAndReplace.FindAndReplace,
  FontBackgroundColor: window.CKEditor5.fontWithPicker.FontBackgroundColor,
  FontColor: window.CKEditor5.fontWithPicker.FontColor,
  FontFamily: window.CKEditor5.fontWithPicker.FontFamily,
  FontSize: window.CKEditor5.fontWithPicker.FontSize,
  GeneralHtmlSupport: window.CKEditor5.htmlSupport.GeneralHtmlSupport,
  Heading: window.CKEditor5.heading.Heading,
  // HeadingButtonsUI: window.CKEditor5.heading.HeadingButtonsUI,
  Highlight: window.CKEditor5.highlight.Highlight,
  HorizontalLine: window.CKEditor5.horizontalLine.HorizontalLine,
  HtmlComment: window.CKEditor5.htmlSupport.HtmlComment,
  HtmlEmbed: window.CKEditor5.htmlEmbed.HtmlEmbed,
  Image: window.CKEditor5.image.Image,
  ImageCaption: window.CKEditor5.image.ImageCaption,
  ImageInsert: window.CKEditor5.image.ImageInsert,
  ImageResize: window.CKEditor5.image.ImageResize,
  ImageStyle: window.CKEditor5.image.ImageStyle,
  ImageToolbar: window.CKEditor5.image.ImageToolbar,
  ImageUpload: window.CKEditor5.image.ImageUpload,
  Indent: window.CKEditor5.indent.Indent,
  IndentBlock: window.CKEditor5.indent.IndentBlock,
  Italic: window.CKEditor5.basicStyles.Italic,
  Link: window.CKEditor5.link.Link,
  LinkImage: window.CKEditor5.link.LinkImage,
  List: window.CKEditor5.list.List,
  ListProperties: window.CKEditor5.list.ListProperties,
  MediaEmbed: window.CKEditor5.mediaEmbed.MediaEmbed,
  MediaEmbedToolbar: window.CKEditor5.mediaEmbed.MediaEmbedToolbar,
  Mention: window.CKEditor5.mention.Mention,
  PageBreak: window.CKEditor5.pageBreak.PageBreak,
  Paragraph: window.CKEditor5.paragraph.Paragraph,
  // ParagraphButtonUI: window.CKEditor5.paragraph.ParagraphButtonUI,
  PasteFromOffice: window.CKEditor5.pasteFromOffice.PasteFromOffice,
  RemoveFormat: window.CKEditor5.removeFormat.RemoveFormat,
  SourceEditing: window.CKEditor5.sourceEditing.SourceEditing,
  SpecialCharacters: window.CKEditor5.specialCharacters.SpecialCharacters,
  SpecialCharactersArrows: window.CKEditor5.specialCharacters.SpecialCharactersArrows,
  SpecialCharactersCurrency: window.CKEditor5.specialCharacters.SpecialCharactersCurrency,
  // SpecialCharactersEssentials: window.CKEditor5.specialCharacters.SpecialCharactersEssentials,
  SpecialCharactersLatin: window.CKEditor5.specialCharacters.SpecialCharactersLatin,
  SpecialCharactersMathematical: window.CKEditor5.specialCharacters.SpecialCharactersMathematical,
  SpecialCharactersText: window.CKEditor5.specialCharacters.SpecialCharactersText,
  StrapiMediaLib: window.CKEditor5.strapiPlugins.StrapiMediaLib,
  StrapiUploadAdapter: window.CKEditor5.strapiPlugins.StrapiUploadAdapter,
  Strikethrough: window.CKEditor5.basicStyles.Strikethrough,
  Style: window.CKEditor5.style.Style,
  Subscript: window.CKEditor5.basicStyles.Subscript,
  Superscript: window.CKEditor5.basicStyles.Superscript,
  Table: window.CKEditor5.table.Table,
  TableCaption: window.CKEditor5.table.TableCaption,
  TableCellProperties: window.CKEditor5.table.TableCellProperties,
  TableColumnResize: window.CKEditor5.table.TableColumnResize,
  TableProperties: window.CKEditor5.table.TableProperties,
  TableToolbar: window.CKEditor5.table.TableToolbar,
  TextPartLanguage: window.CKEditor5.language.TextPartLanguage,
  TodoList: window.CKEditor5.list.TodoList,
  Underline: window.CKEditor5.basicStyles.Underline,
  WordCount: window.CKEditor5.wordCount.WordCount
}


const base = {
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
      { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
    ],
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
    disallow: [
      {
        attributes: [
          { key: /^on(.*)/i, value: true },
          { key: /.*/, value: /(\b)(on\S+)(\s*)=|javascript:|(<\s*)(\/*)script/i },
          { key: /.*/, value: /data:(?!image\/(png|jpeg|gif|webp))/i },
        ],
      },
      { name: "script" },
    ],
  },
  htmlEmbed: {
    showPreviews: true,
    sanitizeHtml: (inputHtml) => {
      const outputHtml = sanitizeHtml(inputHtml);
      return {
        html: outputHtml,
        hasChanged: true,
      };
    },
  },
  mediaEmbed: {
    previewsInData: true
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties'
    ],
  },
  image: {
    toolbar: [
      'linkImage',
      '|',
      // 'toggleImageCaption',
      'imageTextAlternative'
    ],
    insert: {
      integrations: ["insertImageViaUrl"],
    },
  },
  link: {
    defaultProtocol: 'https://',
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
      detectDownloadable: {
        mode: 'automatic',
        callback: url => url.endsWith( '.pdf' ),
        attributes: {
          target: "_blank",
          rel: "noopener",
        }
      },
      makeLinkWithIcon: {
        mode: 'manual',
        label: 'Learn more link',
        attributes: {
            class: 'learn-more-link',
        }
      },
      makeButton: {
        mode: 'manual',
        label: 'Primary button',
        attributes: {
            class: 'btn btn-primary',
            role: "button"
        }
      },
      makeSecondaryButton: {
        mode: 'manual',
        label: 'Secondary button',
        attributes: {
          class: 'btn btn-secondary',
          role: "button"
        }
      },
    },
  },
  list: {
    properties: {
      styles: false
    }
  },
  style: {
    definitions: [
      {
        name: "Callout box",
        element: "blockquote",
        classes: ["callout-box"],
      },
      {
        name: "Legacy link",
        element: "a",
        classes: ["legacy-link"],
      },
      // not working any more, need a new approach
      // {
      //   name: "Lettered list",
      //   element: "li",
      //   classes: ["lower-alpha"],
      // },
    ],
  },
};

const toolbarConfig = [
  'heading',
  'style',
  '|',
  'bold', 'italic',
  'underline',
  '|',
  'link',
  'strapiMediaLib',
  '|',
  'bulletedList',
  'numberedList',
  '|',
  'horizontalLine',
  'blockQuote',
  'insertTable',
  'mediaEmbed', '|',
  'removeFormat',
  'SourceEditing'
];

const basePlugins = [
  w.Alignment,
  w.Autoformat,
  w.AutoImage,
  w.BlockQuote,
  w.Bold,
  w.Code,
  w.CodeBlock,
  w.DocumentList,
  w.DocumentListProperties,
  w.Essentials,
  w.FontBackgroundColor,
  w.FontColor,
  w.FontFamily,
  w.FontSize,
  w.GeneralHtmlSupport,
  w.Heading,
  w.HorizontalLine,
  w.HtmlEmbed,
  w.Image,
  w.ImageCaption,
  w.ImageInsert,
  w.ImageResize,
  w.ImageStyle,
  w.ImageToolbar,
  w.ImageUpload,
  w.Indent,
  w.IndentBlock,
  w.Italic,
  w.Link,
  w.LinkImage,
  w.LinkImage,
  w.MediaEmbed,
  w.PageBreak,
  w.Paragraph,
  w.PasteFromOffice,
  w.RemoveFormat,
  w.SourceEditing,
  w.SpecialCharacters,
  w.SpecialCharactersArrows,
  w.SpecialCharactersCurrency,
  w.SpecialCharactersLatin,
  w.SpecialCharactersMathematical,
  w.SpecialCharactersText,
  w.StrapiMediaLib,
  w.StrapiUploadAdapter,
  w.Strikethrough,
  w.Style,
  w.Subscript,
  w.Superscript,
  w.Table,
  w.TableCaption,
  w.TableCellProperties,
  w.TableColumnResize,
  w.TableProperties,
  w.TableToolbar,
  w.Underline,
  w.WordCount,
];

export const toolbarEditorConfig = {
  plugins:basePlugins,
  ...base,
  toolbar: toolbarConfig,
}

export const toolbarBaloonEditorConfig = {
  plugins:[...basePlugins, w.BalloonToolbar],
  ...base,
  toolbar: toolbarConfig,

}

export const blockBaloonEditorConfig = {
  plugins:[
    ...basePlugins.filter(({pluginName})=>
      pluginName !== "SourceEditing" &&
      pluginName !== "SpecialCharacters" &&
      pluginName !== "SpecialCharactersArrows" &&
      pluginName !== "SpecialCharactersCurrency" &&
      pluginName !== "SpecialCharactersEssentials" &&
      pluginName !== "SpecialCharactersLatin" &&
      pluginName !== "SpecialCharactersMathematical" &&
      pluginName !== "SpecialCharactersText" &&
      pluginName !== "PageBreak" &&
      pluginName !== "HorizontalLine" &&
      pluginName !== "MediaEmbed" &&
      pluginName !== "HtmlEmbed" &&
      pluginName !== "Code" &&
      pluginName !== "CodeBlock"
    ),
    w.BlockToolbar, w.BalloonToolbar
  ],
  ...base,
  blockToolbar: toolbarConfig
}
