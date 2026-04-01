// ═══════════════════════════════════════════════════════════
// Editor.js Tool Configuration
// ═══════════════════════════════════════════════════════════

/**
 * Creates the Editor.js tools configuration.
 * Uses dynamic imports for SSR safety — Editor.js is browser-only.
 */
export async function createEditorTools(
	uploadHandler: (file: File) => Promise<{ success: boolean; file: { url: string } }>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Record<string, any>> {
	const [Header, ImageTool, Quote, List, CodeTool, Delimiter, InlineCode] = await Promise.all([
		import('@editorjs/header').then((m) => m.default),
		import('@editorjs/image').then((m) => m.default),
		import('@editorjs/quote').then((m) => m.default),
		import('@editorjs/list').then((m) => m.default),
		import('@editorjs/code').then((m) => m.default),
		import('@editorjs/delimiter').then((m) => m.default),
		import('@editorjs/inline-code').then((m) => m.default)
	]);

	return {
		header: {
			class: Header,
			config: {
				placeholder: 'Überschrift eingeben...',
				levels: [2, 3, 4],
				defaultLevel: 2
			},
			inlineToolbar: true
		},
		image: {
			class: ImageTool,
			config: {
				uploader: {
					uploadByFile: uploadHandler
				},
				captionPlaceholder: 'Bildunterschrift (optional)'
			}
		},
		quote: {
			class: Quote,
			config: {
				quotePlaceholder: 'Zitat eingeben...',
				captionPlaceholder: 'Quelle / Autor'
			},
			inlineToolbar: true
		},
		list: {
			class: List,
			inlineToolbar: true,
			config: {
				defaultStyle: 'unordered'
			}
		},
		code: {
			class: CodeTool,
			config: {
				placeholder: 'Code eingeben...'
			}
		},
		delimiter: {
			class: Delimiter
		},
		inlineCode: {
			class: InlineCode
		}
	};
}
