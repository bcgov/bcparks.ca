import ckeditor5Dll from "ckeditor5/build/ckeditor5-dll.js";
import ckeditor5MrkdownDll from "@ckeditor/ckeditor5-markdown-gfm/build/markdown-gfm.js";

const config = {};

const bootstrap = (app) => { };

export default {
  config,
  bootstrap,
};

// import { Autoformat, Bold, Italic, Essentials, Heading } from "ckeditor5";
// import {
//   setPluginConfig,
//   defaultHtmlPreset,
//   StrapiMediaLib,
//   StrapiUploadAdapter,
// } from "@_sh/strapi-plugin-ckeditor";

// const CKEConfig = () => ({
//   presets: [
//     {
//       ...defaultHtmlPreset,

//       /**
//        * If you use default preset and haven't updated your schemas to replace
//        * the `default` preset with `defaultHtml`, you can change `name`
//        * in defaultHtmlPreset to 'default' to avoid missing preset error.
//        */
//       // name: 'default',

//       editorConfig: {
//         ...defaultHtmlPreset.editorConfig,
//         toolbar: [
//           "heading",
//           "|",
//           "bold",
//           "italic",
//           "|",
//           "strapiMediaLib",
//           "|",
//           "undo",
//           "redo",
//         ],
//       },
//     },
//     {
//       name: "myCustomPreset",
//       description: "My custom preset",
//       editorConfig: {
//         licenseKey: "GPL",
//         plugins: [
//           Autoformat,
//           Bold,
//           Italic,
//           Essentials,
//           Heading,
//           StrapiMediaLib,
//           StrapiUploadAdapter,
//           //...
//         ],
//         toolbar: [
//           "heading",
//           "|",
//           "bold",
//           "italic",
//           "|",
//           "strapiMediaLib",
//           "|",
//           "undo",
//           "redo",
//         ],
//         //...
//       },
//     },
//   ],
//   // theme: {},
// });

// const bootstrap = (app) => {};

// export default {
//   register() {
//     const myConfig = CKEConfig();
//     setPluginConfig(myConfig);
//   },
//   bootstrap,
// };