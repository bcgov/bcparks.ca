/**
 * @license Copyright (c) 2014-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import AutoLink from '@ckeditor/ckeditor5-link/src/autolink.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js';
import MediaEmbedToolbar from '@ckeditor/ckeditor5-media-embed/src/mediaembedtoolbar.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting.js';
import Style from '@ckeditor/ckeditor5-style/src/style.js';
import Table from '@ckeditor/ckeditor5-table/src/table.js';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat.js';

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
	BlockQuote,
	Bold,
	Essentials,
	GeneralHtmlSupport,
	Heading,
	HorizontalLine,
	Italic,
	Link,
	AutoLink,
	List,
	MediaEmbed,
	MediaEmbedToolbar,
	Paragraph,
	SourceEditing,
	Style,
	Table,
	Underline,
	RemoveFormat
];

// Editor configuration.
Editor.defaultConfig = {
	toolbar: {
		items: [
			'sourceEditing',
			'heading',
			'style',
			'|',
			'bold',
			'italic',
			'underline',
			'bulletedList',
			'numberedList',
			'link',
			'horizontalLine',
			'|',
			'blockQuote',
			'insertTable',
			'mediaEmbed'
		]
	},
	language: 'en'
};

export default Editor;
