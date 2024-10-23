import { css } from "styled-components";
import "@fortawesome/fontawesome-free/css/all.css";

// Add BC Parks Override CSS at the bottom of this file only

export const common = css`
  .ck {
    --ck-color-image-caption-background: hsl(0, 0%, 97%);
    --ck-color-image-caption-text: hsl(0, 0%, 20%);
    --ck-color-mention-background: hsla(341, 100%, 30%, 0.1);
    --ck-color-mention-text: hsl(341, 100%, 30%);
    --ck-color-table-caption-background: hsl(0, 0%, 97%);
    --ck-color-table-caption-text: hsl(0, 0%, 20%);
    --ck-highlight-marker-blue: hsl(201, 97%, 72%);
    --ck-highlight-marker-green: hsl(120, 93%, 68%);
    --ck-highlight-marker-pink: hsl(345, 96%, 73%);
    --ck-highlight-marker-yellow: hsl(60, 97%, 73%);
    --ck-highlight-pen-green: hsl(112, 100%, 27%);
    --ck-highlight-pen-red: hsl(0, 85%, 49%);
    --ck-image-style-spacing: 1.5em;
    --ck-inline-image-style-spacing: calc(var(--ck-image-style-spacing) / 2);
    --ck-todo-list-checkmark-size: 16px;
  }


  .ck.ck-sticky-panel .ck-sticky-panel__content_sticky {
    top: 64px !important;
  }
  .ck.ck-reset.ck-dropdown__panel.ck-dropdown__panel_sw.ck-dropdown__panel-visible {
    border-radius: 4px;
  }

  .ck-editor__main {

    --ck-font-face: "Source Sans Pro", system-ui, Roboto, "Helvetica Neue", "Helvetica", Arial, sans-serif;

    color: var(--ck-color-editor-base-text);
    font-family: var(--ck-font-face);

    * {
      font: revert;
      margin: revert;
    }


    h1 {
      //font-size: 2.3em;
      font-size: 1.95rem; // Custom Styles BCParks
    }

    h2 {
      //font-size: 1.84em;
      font-size: 1.55rem; // Custom Styles BCParks
    }

    h3 {
      //font-size: 1.48em;
      font-size: 1.25rem; // Custom Styles BCParks
      margin: 0 0 24px 0; // Custom Styles BCParks
    }

    h4 {
      //font-size: 1.22em;
      font-size: 1rem; // Custom Styles BCParks
      margin: 0 0 24px 0; // Custom Styles BCParks
    }

    h5 {
      //font-size: 1.06em;
      font-size: 0.90rem; // Custom Styles BCParks
    }

    h6 {
      //font-size: 1em;
      font-size: 0.84rem; // Custom Styles BCParks
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.2em;
      padding-top: .8em;
      margin-bottom: .4em
    }

    blockquote,
    ol,
    p,
    ul {
      font-size: 1em;
      line-height: 1.6em;
      padding-top: .2em;
      margin-bottom: var(--ck-spacing-large)
    }

    figcaption {
      background-color: var(--ck-color-image-caption-background);
      caption-side: bottom;
      color: var(--ck-color-image-caption-text);
      display: table-caption;
      font-size: 0.75em;
      outline-offset: -1px;
      padding: 0.6em;
      word-break: break-word;
    }

    a {
      text-decoration: none;
      color: #1a5a96;
    }

    a:hover {
      text-decoration: underline;
    }

    a:not([href]):not([tabindex]) {
      text-decoration: none;
      color: inherit;
    }

    a.learn-more-link {
      text-decoration: none;
      position: relative;
      padding-right: 14px;
      &:hover {
        text-decoration: underline;
      }
      &::after {
        content: "\f054";
        display: inline-block;
        font-weight: 700;
        font-size: 0.625rem;
        font-family: "Font Awesome 5 Free";
        font-style: normal;
        font-variant: normal;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
        position: absolute;
        top: 4px;
        right: 0;
        line-height: 1;
      }
    }

    .table {
      margin: 0;
      width: 100%; // Custom Styles BCParks
      table {
        width: 100%; // Custom Styles BCParks
        td, th {
          vertical-align: middle; // Custom Styles BCParks
        }
      }
    }

    ul.todo-list {
      list-style: none;
      margin: revert;
      color: revert;
      font-family: revert;
      margin-left: 2rem;
    }

    ul,
    ol {
      list-style: initial;
      margin-left: 2rem;
    }

    sub {
      vertical-align: sub;
    }

    sup {
      vertical-align: super;
    }

    .ck.ck-content.ck-editor__editable {
      line-height: initial;
      min-height: 12.5rem;
      border-bottom-left-radius: 0.25rem;
      border-bottom-right-radius: 0.25rem;
      transition-property: border-color, box-shadow, max-height;
      transition-timing-function: ease-in-out;
      transition-duration: 0.5s;
      &.ck-focused:not(.ck-editor__nested-editable) {
        border: 1px solid var(--ck-color-base-border);
        /* border: var(--ck-focus-ring); */
        box-shadow: none;
        transition-property: border-color, box-shadow, max-height;
        transition-timing-function: ease-in-out;
        transition-duration: 0.5s;
      }
    }

    .ck-focused,
    .ck-blurred {
      overflow-y: auto;
      overflow-x: hidden;
      transition: max-height 0.5s ease-in-out;
      ::-webkit-scrollbar {
        width: 7px;
      }
      ::-webkit-scrollbar-track {
        background: var(--ck-scroll-track-background);
        border: none;
      }
      ::-webkit-scrollbar-thumb {
        transition: background 2s;
        background: var(--ck-scroll-thumb-background);
        border: 1px solid var(--ck-scroll-thumb-border-color);
      }
      ::-webkit-scrollbar-thumb:hover {
        transition: background 2s;
        background: var(--ck-scroll-thumb-hover-background);
      }
      ::-webkit-scrollbar-thumb:active {
        background: var(--ck-scroll-thumb-active-background);
      }
    }
  }

  .ck .ck-source-editing-area textarea{
    color: var(--ck-color-text);
    background-color: var(--ck-color-base-background);
    border: 1px solid var(--ck-color-base-border) !important;
    box-shadow: none !important;
  }

  .ck .ck-block-toolbar-button {
    min-width: 0 !important;
    min-height: 0 !important;
    width: 20px !important;
    height: 25px !important;
    margin-left: -2px !important ;

    & svg {
      color: var(--ck-color-text) !important;
      position: absolute;
      width: 20px;
      height: 20px;
    }
  }

  .ck-word-count {
    margin-top: 0.3rem;
    display: flex;
    justify-content: end;
    gap: 0.3rem;
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: lowercase;
    /* color: #b3b3c4; */
  }

  .ck[dir=rtl]{
    .ck-block-toolbar-button {
      margin-left: 2px !important ;
    }
    & + div{
      justify-content: flex-start;
      & > .ck-word-count {
          & > div:first-child{
            order: 2;
          }
          & > div:last-child{
            order: 1;
          }
      }
    }
  }

  // Custom Styles BC Parks (Start)

  .ck-editor__main {
    img {
      max-width: 100% !important;
    }

    ul {
      list-style-type: disc;
      ul {
        list-style-type: circle !important;
      }
    }

    ol {
      list-style: decimal;
      ol {
        list-style-type: decimal !important;
      }
    }

    blockquote {
      border-left: solid 8px #e6e1d7;
      margin: 16px 0 16px 24px;
      padding: 16px 32px;
    }

    blockquote.callout-box {
      color: #003366 !important;
      background-color: #c7e3fd;
      font-size: 1rem;
      font-weight: 700;
      font-style: normal;
      border-radius: 4px;
      border-left: none;
      padding: 12px 20px;
    }

    blockquote.callout-box a {
      color: $colorBlue !important;
      text-decoration: underline;
    }

    .legacy-link {
      background-color: #FFFF00;
    }

    a.btn {
      height: 48px;
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      line-height: 1.5;
      text-decoration: none;
      border-radius: 4px;
      padding: 0 16px;

      &.btn-primary {
        color: #fff;
        background-color: #003366;
        border: #003366 2px solid;
        &:hover {
          color: #fff;
          background-color: #2464a4;
          border: #2464a4 2px solid;
        }
      }

      &.btn-yellow,
      &.btn-warning {
        color: #003366;
        background-color: #fcba19;
        border: #fcba19 2px solid;
        &:hover {
          color: #fff;
          background-color: #2464a4;
          border: #2464a4 solid 2px;
        }
      }

      &.btn-white {
        color: #003366;
        background-color: #fff;
        border: #fff solid 2px;
        &:hover {
          background-color: #fcba19;
          border: #fcba19 solid 2px;
        }
      }

      &.btn-secondary,
      &.btn-light {
        color: #003366;
        background-color: #fff;
        border: #003366 1px solid;
        &:hover {
          background-color: #ecf6ff;
        }
      }

      &.btn-icon {
        &::after {
          content: "\f138";
          display: inline-block;
          font-size: 0.875rem;
          font-family: "Font Awesome 5 Free";
          font-style: normal;
          font-variant: normal;
          text-rendering: auto;
          -webkit-font-smoothing: antialiased;
          margin-left: 8px;
        }
      }
    }

    ol li.lower-alpha {
      list-style-type: lower-alpha;
    }

    .bcp-landing-intro__image {
      min-height: 300px;
      background-position: center;
    }
  }

  .ck.ck-dropdown.ck-heading-dropdown .ck-dropdown__button .ck-button__label {
      width: 6em;
  }

  // autoGrow onStartup
  .ck.ck-content:not(.ck-comment__input *) {
    max-height: 700px !important;
  }

  // Custom Styles BC Parks (End)

`;
