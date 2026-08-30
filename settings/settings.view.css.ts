namespace $.$$ {

	const { rem } = $mol_style_unit

	$mol_style_define( $bog_pazzle_settings, {

		display: 'flex',
		flexDirection: 'column',
		gap: $mol_gap.block,

		Size_row: {
			display: 'flex',
			alignItems: 'center',
			gap: $mol_gap.text,
			flexWrap: 'wrap',
		},

		Times: {
			color: $mol_theme.shade,
		},

		Presets: {
			display: 'flex',
			gap: $mol_gap.text,
			flexWrap: 'wrap',
		},

		Preset: {
			minWidth: rem( 4 ),
			justifyContent: 'center',
		},

	} )

	$mol_style_attach( 'bog_pazzle_settings_preset', `
		[bog_pazzle_settings_preset][bog_pazzle_current="true"] {
			background: var(--mol_theme_current);
			color: var(--mol_theme_text);
		}
	` )

}
