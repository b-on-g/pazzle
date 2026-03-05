namespace $.$$ {
	$mol_style_define($bog_pazzle_play, {
		display: 'flex',
		flexDirection: 'column',
		flex: {
			grow: 1,
			shrink: 1,
			basis: 0,
		},
		alignItems: 'center',
		gap: $mol_gap.block,
		padding: $mol_gap.block,

		Toolbar: {
			alignSelf: 'stretch',
			display: 'flex',
			alignItems: 'center',
			gap: $mol_gap.block,
		},

		Board: {
			flex: {
				grow: 1,
				shrink: 1,
				basis: 0,
			},
			maxWidth: '80vh',
			width: '100%',
		},
	})
}
