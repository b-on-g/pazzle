namespace $.$$ {
	$mol_style_define($bog_pazzle_board, {
		display: 'flex',
		flexDirection: 'column',
		gap: $mol_gap.block,

		Controls: {
			display: 'flex',
			alignItems: 'center',
			gap: $mol_gap.block,
			flexWrap: 'wrap',
		},

		Grid: {
			display: 'grid',
			gap: '0.25rem',
			border: { radius: $mol_gap.round },
			overflow: 'hidden',
			background: { color: $mol_theme.card },
			boxShadow: `0 0 0 1px ${$mol_theme.line}`,
		},

		Placeholder: {
			color: $mol_theme.shade,
		},
	})
}
