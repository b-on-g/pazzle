namespace $.$$ {

	const { rem, vh } = $mol_style_unit

	$mol_style_define( $bog_pazzle_play, {

		display: 'flex',
		flexDirection: 'column',
		gap: $mol_gap.block,
		alignItems: 'stretch',
		minWidth: 0,

		Toolbar: {
			display: 'flex',
			alignItems: 'center',
			flexWrap: 'wrap',
			gap: $mol_gap.text,
			padding: $mol_gap.text,
			background: { color: $mol_theme.card },
			border: { radius: $mol_gap.round },
			boxShadow: `0 0 0 1px ${ $mol_theme.line }`,
		},

		Clock: {
			font: {
				size: rem( 1.25 ),
				weight: 'bold',
			},
			padding: $mol_gap.text,
		},

		Moves: {
			color: $mol_theme.shade,
			padding: $mol_gap.text,
		},

		Filler: {
			flex: {
				grow: 1,
				shrink: 1,
				basis: 0,
			},
		},

		// доска приходит от корня — адресуем её по классу
		'>': {
			$bog_pazzle_board: {
				maxWidth: vh( 75 ),
				width: '100%',
				alignSelf: 'center',
				minWidth: 0,
			},
		},

	} )

}
