namespace $.$$ {

	const { rem } = $mol_style_unit

	$mol_style_define( $bog_pazzle_board_victory, {

		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: $mol_gap.block,
		zIndex: 20,
		background: { color: '#00000066' },
		border: { radius: $mol_gap.round },

		Card: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			gap: $mol_gap.text,
			maxWidth: rem( 22 ),
			padding: $mol_gap.block,
			textAlign: 'center',
			background: { color: $mol_theme.card },
			border: { radius: $mol_gap.round },
			boxShadow: '0 12px 40px #00000066',
		},

		Title: {
			font: {
				size: rem( 1.5 ),
				weight: 'bold',
			},
		},

		Best: {
			color: $mol_theme.shade,
			font: { size: rem( .875 ) },
		},

		Actions: {
			display: 'flex',
			flexWrap: 'wrap',
			justifyContent: 'center',
			gap: $mol_gap.text,
		},

	} )

	$mol_style_attach( 'bog_pazzle_board_victory_pop', `
		@keyframes bog_pazzle_victory_pop {
			from { opacity: 0; transform: scale( .85 ) }
			to { opacity: 1; transform: scale( 1 ) }
		}
		[bog_pazzle_board_victory] {
			backdrop-filter: blur( 3px );
			-webkit-backdrop-filter: blur( 3px );
		}
		[bog_pazzle_board_victory_card] {
			animation: bog_pazzle_victory_pop .35s ease both;
		}
	` )

}
