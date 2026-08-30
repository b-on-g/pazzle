namespace $.$$ {

	const { rem } = $mol_style_unit

	$mol_style_define( $bog_pazzle_saves_item, {

		display: 'flex',
		alignItems: 'stretch',
		gap: $mol_gap.text,
		padding: $mol_gap.text,
		background: { color: $mol_theme.card },
		border: { radius: $mol_gap.round },
		boxShadow: `0 0 0 1px ${ $mol_theme.line }`,

		Open: {
			flex: {
				grow: 1,
				shrink: 1,
				basis: 0,
			},
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'flex-start',
			gap: $mol_gap.block,
			minWidth: 0,
			textAlign: 'start',
		},

		Thumb: {
			width: rem( 4 ),
			height: rem( 4 ),
			flex: {
				grow: 0,
				shrink: 0,
			},
			objectFit: 'cover',
			border: { radius: $mol_gap.round },
			background: { color: $mol_theme.field },
		},

		Info: {
			display: 'flex',
			flexDirection: 'column',
			gap: 0,
			minWidth: 0,
		},

		Label: {
			font: { weight: 'bold' },
		},

		Stat: {
			color: $mol_theme.shade,
			font: { size: rem( .875 ) },
		},

		Drop: {
			flex: {
				grow: 0,
				shrink: 0,
			},
			alignSelf: 'center',
		},

	} )

	$mol_style_attach( 'bog_pazzle_saves_item_confirm', `
		[bog_pazzle_saves_item_drop][bog_pazzle_confirm="true"] {
			background: var(--mol_theme_special);
			color: var(--mol_theme_text);
		}
	` )

}
