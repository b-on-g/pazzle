namespace $.$$ {
	$mol_style_define($bog_pazzle_board_victory, {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 20,
		background: { color: '#00000033' },

		Card: {
			background: { color: $mol_theme.card },
			boxShadow: `0 8px 32px #00000066`,
			border: { radius: $mol_gap.round },
			padding: {
				top: $mol_gap.block,
				bottom: $mol_gap.block,
				left: $mol_gap.block,
				right: $mol_gap.block,
			},
			textAlign: 'center',
			gap: $mol_gap.space,
		},

		Title: {
			fontSize: '1.5rem',
			fontWeight: 'bold',
		},

		Stats: {
			color: $mol_theme.shade,
		},
	})

	$mol_style_attach('bog_pazzle_victory_backdrop', `
		[bog_pazzle_board_victory] {
			backdrop-filter: blur(4px);
			-webkit-backdrop-filter: blur(4px);
		}
	`)
}
