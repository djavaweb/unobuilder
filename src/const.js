export const MainPrefix = 'uno-builder'
export const ClassPrefix = {
  MAIN: MainPrefix,
  FIELDS: `${MainPrefix}-fields`,
  SCREEN: `${MainPrefix}__screen`,
  ACCORDION: `${MainPrefix}__accordion`,
  LEFT_PANEL: `${MainPrefix}__left-panel`,
  RIGHT_PANEL: `${MainPrefix}__right-panel`,
  TOP_PANEL: `${MainPrefix}__top-panel`,
  WORKSPACE: `${MainPrefix}__workspace`
}

export const ScreenType = {
  LARGE: 'large',
  MEDIUM: 'medium',
  SMALL: 'small',
  TINY: 'tiny'
}

export const ScreenSize = {
  LARGE: 991,
  MEDIUM: 768,
  SMALL: 480,
  TINY: 320
}

export const SafeScreenSize = 1001

export const MoveAction = {
  COPY: 'copy',
  CUT: 'cut'
}

export const VoidElements = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'input',
  'img',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]

export const KindList = [
  'div',
  'row',
  'text',
  'link',
  'form',
  'input',
  'image',
  'button',
  'heading',
  'section',
  'container'
]

export const PropertyList = [
  'display',
  'backgroundColor',
  'backgroundImage',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'borderTop',
  'borderRight',
  'borderBottom',
  'borderLeft',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'fontSize'
]

export const NestedableRules = {
  div: KindList.filter(item => !['div', 'input'].includes(item)),
  row: KindList.filter(item => !['section', 'container', 'row', 'form', 'div', 'input'].includes(item)),
  column: KindList.filter(item => !['section', 'container', 'column', 'input'].includes(item)),
  text: KindList.filter(item => item === 'link'),
  link: [],
  form: KindList.filter(item => !['section', 'container', 'form'].includes(item)),
  input: [],
  image: [],
  button: [],
  heading: [],
  section: KindList.filter(item => !['section', 'input'].includes(item)),
  container: KindList.filter(item => !['section', 'container', 'input'].includes(item))
}

export const Panels = {
  LEFT: 'leftPanel',
  CENTER: 'centerPanel',
  RIGHT: 'rightPanel'
}

export const Labels = {
  EMPTY: '',
  UNTITLED: 'Untitled',
  NO_ITEMS: 'No Items',
  SCREEN_LARGE: 'Desktop Screen',
  SCREEN_MEDIUM: 'Tablet Potrait',
  SCREEN_SMALL: 'Phone Landscape',
  SCREEN_TINY: 'Phone Landscape',
  ADD_ELEMENT: 'Add Element',
  SEARCH_ELEMENT: 'Seach Element',
  PAGE_PROPERTIES: 'Page Options',
  GLOBAL_PROPERTIES: 'Global Options',
  BROWSER_TOO_SMALL: 'Your browser is too small',
  RESIZE_BROWSER: `Resize your browser to be at least ${SafeScreenSize - 1}px wide to get back into design mode.`,
  DISPLAY_PROPERTIES: 'Display',
  LAYOUT_PROPERTIES: 'Layout',
  SIZE_PROPERTIES: 'Size',
  TYPOGRAPHY_PROPERTIES: 'Typography',
  BACKGROUND_PROPERTIES: 'Background',
  ATTRIBUTE_PROPERTIES: 'Attributes',
  SELECT_TYPE: 'Select Type',
  FLEX_LAYOUT_SETTINGS: 'Flex Layout Settings',
  FLEX_CHILD_SETTINGS: 'Flex Child Settings',
  FLEX_SIZING: 'Sizing',
  FLEX_ALIGN_SELF: 'Align',
  FLEX_ORDER: 'Order',
  FLEX_ORDER_AUTO: 'auto',
  GRID_GUTTER: 'Grid Gutter',
  MOUSE_STATE_NONE: 'none',
  MOUSE_STATE_HOVER: 'hover',
  MOUSE_STATE_ACTIVE: 'active',
  MOUSE_STATE_FOCUS: 'focus',
  WIDTH: 'Width',
  HEIGHT: 'Height',
  MIN: 'Min',
  MAX: 'Max',
  SAVE: 'Save',
  UNIT_AUTO: '-'
}

export const Icons = {
  ADD_ELEMENT: 'add-element',
  CODE_EDITOR: 'code-editor',
  SCREEN_LARGE: 'screen-large',
  SCREEN_MEDIUM: 'screen-medium',
  SCREEN_SMALL: 'screen-small',
  SCREEN_TINY: 'screen-tiny',
  EXPAND: 'arrow-expanded',
  COLLAPSE: 'arrow-collapsed',
  DISPLAY_BLOCK: 'display-block',
  DISPLAY_INLINE_BLOCK: 'display-inline-block',
  DISPLAY_NONE: 'display-none',
  DISPLAY_INLINE: 'display-inline',
  FLEX_SHRINK: 'flex-shrink',
  FLEX_GROW: 'flex-grow',
  FLEX_NO_SHRINK: 'flex-no-shrink',
  FLEX_ALIGN_SELF_START: 'flex-align-self-start',
  FLEX_ALIGN_SELF_END: 'flex-align-self-end',
  FLEX_ALIGN_SELF_CENTER: 'flex-align-self-center',
  FLEX_ALIGN_SELF_BASELINE: 'flex-align-self-baseline',
  FLEX_ALIGN_SELF_STRETCH: 'flex-align-self-stretch',
  FLEX_ORDER_FIRST: 'flex-order-first',
  FLEX_ORDER_LAST: 'flex-order-last',
  DISPLAY_FLEX: 'display-flex',
  GUTTER_LARGE: 'gutter-large',
  GUTTER_MEDIUM: 'gutter-medium',
  GUTTER_SMALL: 'gutter-small',
  GUTTER_NONE: 'gutter-none',
  SAVE: 'save',
  MOUSE: 'mouse',
  PREVIEW: 'preview',
  UNDO: 'undo',
  REDO: 'redo',
  ARROW_UP: 'arrow-up-input',
  ARROW_DOWN: 'arrow-down-input'
}

export const Tooltips = {
  NO_TOOLTIPS: 'No Tooltips',
  ADD_ELEMENT: 'Add elements',
  CODE_EDITOR: 'CSS Editor',
  SCREEN_LARGE: Labels.SCREEN_LARGE,
  SCREEN_MEDIUM: Labels.SCREEN_MEDIUM,
  SCREEN_SMALL: Labels.SCREEN_SMALL,
  SCREEN_TINY: Labels.SCREEN_TINY,
  PAGE_PROPERTIES: 'Change element properties only on this page',
  GLOBAL_PROPERTIES: 'Change element properties on every pages',
  MOUSE_STATE: 'Change Element State: <br />Normal, Hover, Visited',
  ADVANCED_VIEW: 'View Advanced Properties',
  UNDO_CHANGES: 'Undo Changes',
  REDO_CHANGES: 'Redo Changes',
  SAVE_CHANGES: 'Save Changes',
  PREVIEW: 'Preview',
  DISPLAY_BLOCK: 'Block',
  DISPLAY_INLINE: 'Inline',
  DISPLAY_INLINE_BLOCK: 'Inline Block',
  DISPLAY_FLEX: 'Flex',
  DISPLAY_NONE: 'None',
  FLEX_SHRINK: 'Shrink if needed',
  FLEX_GROW: 'Fill empty space',
  FLEX_NO_SHRINK: 'Dont\'t shrink',
  FLEX_ALIGN_SELF_START: 'Align Start',
  FLEX_ALIGN_SELF_END: 'Align End',
  FLEX_ALIGN_SELF_CENTER: 'Align Center',
  FLEX_ALIGN_SELF_BASELINE: 'Align Baseline',
  FLEX_ALIGN_SELF_STRETCH: 'Align Stretch',
  FLEX_ORDER_AUTO: 'Order Auto',
  FLEX_ORDER_FIRST: 'Order First',
  FLEX_ORDER_LAST: 'Order Last',
  GUTTER_LARGE: 'Gutter Large',
  GUTTER_MEDIUM: 'Gutter Medium',
  GUTTER_SMALL: 'Gutter Small',
  GUTTER_NONE: 'No Gutter',
  UNIT_PX: 'Pixel',
  UNIT_EM: 'EM Unit',
  UNIT_VH: 'View Height',
  UNIT_VW: 'View Width',
  UNIT_PERCENT: '% from parent'
}

export const PropertyPanelIds = {
  COMPONENT: 'component',
  CSS_EDITOR: 'css_editor',
  DISPLAY: 'display',
  LAYOUT: 'layout',
  SIZE: 'size',
  TYPOGRAPHY: 'typography',
  BACKGROUND: 'background',
  ATTRIBUTE: 'attribute'
}

export const ButtonType = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  BORDERED: 'bordered'
}

export const InputType = {
  TEXT: 'text',
  SEARCH: 'search'
}

export const Units = {
  PX: 'px',
  EM: 'em',
  VH: 'vh',
  VW: 'vw',
  PERCENT: '%'
}