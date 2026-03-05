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
			width: '100%',
			maxWidth: '100%',
			position: 'relative',
		},

		Placeholder: {
			color: $mol_theme.shade,
		},
	})

	$mol_style_attach('bog_pazzle_board_solved', `
		[bog_pazzle_solved="true"] {
			gap: 0 !important;
		}
		[bog_pazzle_solved="true"] [data-bog-pazzle-slot] {
			box-shadow: none !important;
		}
	`)
}
