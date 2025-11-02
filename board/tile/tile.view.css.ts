namespace $.$$ {
	$mol_style_define($bog_pazzle_board_tile, {
		minHeight: '4rem',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		background: {
			repeat: 'no-repeat',
			color: $mol_theme.back,
		},
		boxShadow: `inset 0 0 0 1px ${$mol_theme.line}`,
		position: 'relative',
		cursor: 'pointer',

		Number: {
			position: 'absolute',
			top: $mol_gap.block,
			right: $mol_gap.block,
			fontSize: '.75rem',
			padding: {
				top: 0,
				bottom: 0,
				left: $mol_gap.round,
				right: $mol_gap.round,
			},
			background: {
				color: $mol_theme.shade,
			},
			color: 'white',
			border: { radius: $mol_gap.round },
			display: 'inline-flex',
			':empty': {
				display: 'none',
			},
			pointerEvents: 'none',
		},

	})
}
