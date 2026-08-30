namespace $.$$ {

	const { rem } = $mol_style_unit

	$mol_style_define( $bog_pazzle_board, {

		display: 'flex',
		flexDirection: 'column',
		gap: $mol_gap.block,
		minWidth: 0,

		Placeholder: {
			color: $mol_theme.shade,
			textAlign: 'center',
			padding: $mol_gap.block,
		},

		Field: {
			position: 'relative',
			display: 'flex',
			flexDirection: 'column',
			alignSelf: 'center',
			width: '100%',
			minWidth: 0,
		},

		Grid: {
			display: 'grid',
			gap: rem( .25 ),
			width: '100%',
			background: { color: $mol_theme.field },
			boxShadow: `0 0 0 1px ${ $mol_theme.line }`,
			transition: 'gap .35s ease',
			touchAction: 'none',
		},

		Peek: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			objectFit: 'fill',
			border: { radius: $mol_gap.round },
			zIndex: 15,
			pointerEvents: 'none',
			boxShadow: `0 0 0 2px ${ $mol_theme.focus }`,
		},

	} )

	// собранный пазл смыкается в цельную картинку
	$mol_style_attach( 'bog_pazzle_board_assembled', `
		[bog_pazzle_assembled="true"] {
			gap: 0 !important;
		}
		[bog_pazzle_assembled="true"] [bog_pazzle_board_tile] {
			box-shadow: none !important;
		}
	` )

}
