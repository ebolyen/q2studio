Introduction to the q2studio backend
------------------------------------

```
domain: {
	plugins: {
		byId: { ... },
		allIds: { ... }
	},
	actions: {
		byId: { ... }
	}
},
application: {
	actions: {
		activeIds: [ ... ],
		unavailable: {
			byId: { ... },
			allIds: [ ... ]
		},
		pending: {
			byId: { ... }
			allIds: [ ... ]
		},
	},
	files: {
		artifacts: {
			byId: { ... },
			allIds: [ ... ],
			extantIds: [ ... ],
			pendingIds: [ ... ]
		},
		visualizations: {
			byId: { ... },
			allIds: [ ... ],
			pendingIds: [ ... ]
		},
		metadata: {
			byId: { ... },
			allIds: [ .. ],
			pendingIds: [ ... ]
		}
	}
},
ui: {
	main: {
		byId: { ... },
		allIds: [ ... ],
		pending: [ ... ]
	},
	result: {
		byId: { ... },
		allIds: [ ... ],
		pending: [ ... ]
	},
	action: {
		byId: { ... },
		allIds: [ ... ],
		pending: [ ... ]
	},
	job: {
		byId: { ... },
		allIds: [ ... ],
		pending: [ ... ]
	}
}
```
