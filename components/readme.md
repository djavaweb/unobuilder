# Custom Components

Developers are allowed to extends their own components.

## Tutorial

All components are in JSON. In this case We'll make a simple text component with basic settings: ```font-family```, ```color```, group of buttons to set ```font-weight```, ```font-style``` italic.

```
{
	/* Extension Name */
	name: "Text",

	/* Icon will be used in components panel */
	icon: "",

	/* Default value */
	value: "Lorem ipsum dolor sit amet, nemore rationibus pro ea, est nisl vero ei. Sale libris quidam sit ea, veri impetus at cum. Eu duo viris facete feugait, ex dicta summo his. Vel legimus accusam at, esse laoreet ut mea. In affert nostro mea, duo ad molestie voluptatum, persius theophrastus ad vix. Mel euismod epicurei percipitur ne. Nec ut tation epicuri eleifend, vel sumo modus et.",

	/* Accepted only on column element */
	accept: 'column',

	/* Template in Viewer */
	template: "<component>$data</component>",

	/* Use advanced switcher */
	advancedMenu: true,

	/* Default value of advanced switcher */
	advancedValue: false,

	/* Settings Form, see Setting Sections to see All options */
	settings: [
		{
			/* Form Label */
			label: 'Font Family',

			/* Property value used as CSS property */
			property: 'font-family',

			/* Default value */
			value: 'Arial',

			/* Input type is <select> options see Form Reference below to see Form Type */
			type: 'options',

			/* Options Value */
			options: ['Arial', 'Tahoma', 'Verdana']
		},

		{
			label: 'Color',
			property: 'color',
			value: '#000000',
			type: 'colorpicker'
		},

		{
			label: 'Text Style',
			type: 'buttons',
			group: false,
			buttons: [
				{
					label: 'Font Weight',
					property: 'font-weight',
					value: true,
					trueval: 'bold',
					falseval: '',
					type: 'toggle',
					icon: 'http://youricon'
				},

				{
					label: 'Font Style',
					property: 'font-style',
					value: true,
					trueval: 'italic',
					falseval: '',
					type: 'toggle',
					icon: 'http://youricon'
				},
			]
		},

		{
			advance: true,
			type: 'expandview',
			title: 'Text testing',

		}
	],

	/* Load external Javascripts */
	js: ['test.js', 'http://javascript/external/url']
}
```