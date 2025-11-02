namespace $.$$ {
	$mol_style_define($bog_pazzle_layout, {
		Content: {
			alignItems: 'flex-start',
			gap: $mol_gap.block,
		},
		Menu: {
			flex: {
				basis: '16rem',
				grow: 0,
				shrink: 0,
			},
		},
		Workspace: {
			flex: {
				grow: 1,
				shrink: 1,
				basis: '0',
			},
			display: 'flex',
			flexDirection: 'column',
			gap: $mol_gap.block,
		},
	})
}
