/**
* Used for adding extra <meta> tags for Open Graph. These tags should
* automatically override existing meta tags of the same name when read by the
* browser.
*
* @property {string} property - The property of the tag.
* @property {string} content - The content that gets displayed.
* @property {boolean} isName - Should the tag use 'name' instead of 'property'.

* @example
* const extra_og: OGPropsExtra = {
*   property: 'og:image',
*   content: 'https://example.com/example.jpg',
*   isName: false
* }
* // Output
* <meta property="og:image" content="https://example.com/example.jpg" />
*
* @example
* const extra_og: OGPropsExtra = {
*   property: 'og:image:alt',
*   content: 'Example Image',
*   isName: true
* }
* // Output
* <meta name="og:image:alt" content="Example Image" />
*/
type OGPropsExtra = {
  property: string;
  content: string;
  isName?: false;
};

export type { OGPropsExtra };
