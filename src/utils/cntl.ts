/**
 * A utility function for composing class names in a more readable way.
 * Especially useful with Tailwind CSS where you need to compose many class names.
 * 
 * @param template - Template strings array
 * @param templateElements - Template elements to interpolate
 * @returns Cleaned and trimmed class string
 * 
 * @example
 * const classes = cntl`
 *   base-class
 *   ${condition ? 'conditional-class' : ''}
 *   another-class
 * `;
 */
export function cntl(template: TemplateStringsArray, ...templateElements: any[]) {
  return template
    .reduce((sum, n, index) => {
      const templateElement = templateElements[index];
      if (typeof templateElement === 'string') {
        return `${sum}${n}${templateElement}`;
      }
      return `${sum}${n}`;
    }, '')
    .trim()
    .replace(/\s{2,}/g, ' ');
}
