const constant = {
    COMPONENT_REST_URL: 'https://rawgit.com/djavaweb/unobuilder/new/components.json',
    GOOGLE: {
    	apiKey: 'AIzaSyALxXBrp1LxICQoso23j0Ls46aI7QZCktU',
    	endpointUrl: 'https://www.googleapis.com/webfonts/v1/webfonts?fields=items%2Ffamily&key='
    },
    NATIVE_FONTS: [
        'Inherit (Default)',
        'Andale Mono',
        'Arial',
        'Arial Black',
        'Arial Narrow',
        'Arial Rounded MT Bold',
        'Avant Garde',
        'Baskerville',
        'Big Caslon',
        'Bodoni MT',
        'Book Antiqua',
        'Brush Script MT',
        'Calibri',
        'Calisto MT',
        'Cambria',
        'Candara',
        'Century Gothic',
        'Consolas',
        'Copperplate',
        'Courier New',
        'Didot',
        'Fantasy',
        'Franklin Gothic Medium',
        'Futura',
        'Garamond',
        'Geneva',
        'Georgia',
        'Gill Sans',
        'Goudy Old Style',
        'Helvetica',
        'Hoefler Text',
        'Impact',
        'Lucida Bright',
        'Lucida Console',
        'Lucida Grande',
        'Lucida Sans Typewriter',
        'Monaco',
        'Monospaced',
        'Optima',
        'Palatino',
        'Papyrus',
        'Perpetua',
        'Rockwell',
        'Rockwell Extra Bold',
        'Script',
        'Segoe UI',
        'Serif',
        'Tahoma',
        'Times New Roman',
        'Trebuchet MS',
        'Verdana'
    ],

    PROPERTIES: {
    	id: '',
    	klass: '',
    	gutter: {
    		value: 'medium'
    	},
    	display: {
    		value: 'block',
    		disabled: false,
    		settings: {
    			flex: {
    				container: {
    					direction: 'row',
    					reverse: false,
    					alignItems: 'stretch',
    					alignContent: 'stretch',
    					justifyContent: 'flex-start',
    					wrap: true,
    					reverseWrap: false
    				},
    				item: {
    					sizing: {value: 'flexGrow', custom: {}},
    					order: {value: 'auto', custom: {}},
    					forceAlign: false,
    					alignSelf: 'flex-start'
    				}
    			}
    		}
    	},
    	position: {
    		value: 'relative',
    		settings: {
    			absolute: {
    				top: {
    					value: 0,
    					unit: 'px'
    				},
    				right: {
    					value: 0,
    					unit: 'px'
    				},
    				bottom: {
    					value: 0,
    					unit: 'px'
    				},
    				left: {
    					value: 0,
    					unit: 'px'
    				}
    			},

    			fixed: {
    				top: {
    					value: 0,
    					unit: 'px'
    				},
    				right: {
    					value: 0,
    					unit: 'px'
    				},
    				bottom: {
    					value: 0,
    					unit: 'px'
    				},
    				left: {
    					value: 0,
    					unit: 'px'
    				}
    			}
    		}
    	},
    	paddingTop: {
    		value: 0,
    		unit: 'px'
    	},
    	paddingBottom: {
    		value: 0,
    		unit: 'px'
    	},
    	paddingLeft: {
    		value: 0,
    		unit: 'px'
    	},
    	paddingRight: {
    		value: 0,
    		unit: 'px'
    	},
    	marginTop: {
    		value: 0,
    		unit: 'px'
    	},
    	marginBottom: {
    		value: 0,
    		unit: 'px'
    	},
    	marginLeft: {
    		value: 0,
    		unit: 'px'
    	},
    	marginRight: {
    		value: 0,
    		unit: 'px'
    	},
    	borderTop: {
    		value: 0,
    		unit: 'px',
    		borderStyle: 'solid',
    		color: {
    			hex: '#000000',
    			hsl: {
    				h: 0,
    				s: 0,
    				l: 0,
    				a: 1
    			},
    			hsv: {
    				h: 0,
    				s: 0,
    				v: 0,
    				a: 1
    			},
    			rgba: {
    				r: 0,
    				g: 0,
    				b: 0,
    				a: 1
    			},
    			a: 1
    		}
    	},
    	borderRight: {
    		value: 0,
    		unit: 'px',
    		borderStyle: 'solid',
    		color: {
    			hex: '#000000',
    			hsl: {
    				h: 0,
    				s: 0,
    				l: 0,
    				a: 1
    			},
    			hsv: {
    				h: 0,
    				s: 0,
    				v: 0,
    				a: 1
    			},
    			rgba: {
    				r: 0,
    				g: 0,
    				b: 0,
    				a: 1
    			},
    			a: 1
    		}
    	},
    	borderBottom: {
    		value: 0,
    		unit: 'px',
    		borderStyle: 'solid',
    		color: {
    			hex: '#000000',
    			hsl: {
    				h: 0,
    				s: 0,
    				l: 0,
    				a: 1
    			},
    			hsv: {
    				h: 0,
    				s: 0,
    				v: 0,
    				a: 1
    			},
    			rgba: {
    				r: 0,
    				g: 0,
    				b: 0,
    				a: 1
    			},
    			a: 1
    		}
    	},
    	borderLeft: {
    		value: 0,
    		unit: 'px',
    		borderStyle: 'solid',
    		color: {
    			hex: '#000000',
    			hsl: {
    				h: 0,
    				s: 0,
    				l: 0,
    				a: 1
    			},
    			hsv: {
    				h: 0,
    				s: 0,
    				v: 0,
    				a: 1
    			},
    			rgba: {
    				r: 0,
    				g: 0,
    				b: 0,
    				a: 1
    			},
    			a: 1
    		}
    	},
    	borderRadiusTopLeft: {
    		value: 0,
    		unit: 'px'
    	},
    	borderRadiusTopRight: {
    		value: 0,
    		unit: 'px'
    	},
    	borderRadiusBottomLeft: {
    		value: 0,
    		unit: 'px'
    	},
    	borderRadiusBottomRight: {
    		value: 0,
    		unit: 'px'
    	},
    	width: {
    		value: 'auto',
    		unit: 'px',
    		disabled: false
    	},
    	minWidth: {
    		value: '',
    		unit: 'px',
    		disabled: false
    	},
    	maxWidth: {
    		value: '',
    		unit: 'px',
    		disabled: false
    	},
    	height: {
    		value: 'auto',
    		unit: 'px',
    		disabled: false
    	},
    	minHeight: {
    		value: '',
    		unit: 'px',
    		disabled: false
    	},
    	maxHeight: {
    		value: '',
    		unit: 'px',
    		disabled: false
    	},

    	/* Typography */
    	fontFamily: {
    		value: 'Inherit (Default)'
    	},
    	fontWeight: {
    		value: 100
    	},
    	fontSize: {
    		value: 14,
    		unit: 'px'
    	},
    	fontStyle: {
    		value: 'normal'
    	},
    	fontColor: {
    		hex: '#000000',
    		hsl: {
    			h: 0,
    			s: 0,
    			l: 0,
    			a: 1
    		},
    		hsv: {
    			h: 0,
    			s: 0,
    			v: 0,
    			a: 1
    		},
    		rgba: {
    			r: 0,
    			g: 0,
    			b: 0,
    			a: 1
    		},
    		a: 1
    	},
    	lineHeight: {
    		value: 17,
    		unit: 'px',
    		disabled: false
    	},
    	letterSpacing: {
    		value: 0,
    		unit: 'px',
    		disabled: false
    	},
    	textAlign: {
    		value: 'left'
    	},
    	textDecoration: {
    		value: 'none'
    	},
    	background: {
    		value: 'none',
    		disabled: false,
    		settings: {
    			color: {
    				hex: '#ffffff',
    				hsl: {
    					h: 0,
    					s: 0,
    					l: 1,
    					a: 1
    				},
    				hsv: {
    					h: 0,
    					s: 0,
    					v: 1,
    					a: 1
    				},
    				rgba: {
    					r: 255,
    					g: 255,
    					b: 255,
    					a: 1
    				},
    				a: 1
    			},
    			image: {},
    			video: {},
    			gradient: {}
    		}
    	}
    }
}

export default constant
