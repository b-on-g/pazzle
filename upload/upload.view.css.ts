namespace $.$$ {

	$mol_style_define( $bog_pazzle_upload, {

		display: 'flex',
		flexDirection: 'column',
		gap: $mol_gap.block,
		padding: $mol_gap.block,
		background: { color: $mol_theme.card },
		border: { radius: $mol_gap.round },
		boxShadow: `0 0 0 1px ${ $mol_theme.line }`,
		minWidth: 0,

		Hint: {
			color: $mol_theme.shade,
		},

		Settings_title: {
			font: { weight: 'bold' },
		},

		Preview_title: {
			font: { weight: 'bold' },
		},

		Start: {
			justifyContent: 'center',
		},

	} )

}
