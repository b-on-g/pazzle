namespace $.$$ {

	const { rem } = $mol_style_unit

	$mol_style_define( $bog_pazzle_board_tile, {

		display: 'flex',
		alignItems: 'flex-start',
		justifyContent: 'flex-end',
		position: 'relative',
		minWidth: 0,
		minHeight: 0,
		touchAction: 'none',
		userSelect: 'none',
		background: {
			repeat: 'no-repeat',
			color: $mol_theme.back,
		},

		Number: {
			font: { size: rem( .75 ) },
			padding: {
				top: 0,
				bottom: 0,
				left: $mol_gap.round,
				right: $mol_gap.round,
			},
			margin: rem( .125 ),
			background: { color: $mol_theme.shade },
			color: $mol_theme.card,
			border: { radius: $mol_gap.round },
			pointerEvents: 'none',
			':empty': {
				display: 'none',
			},
		},

	} )

}
