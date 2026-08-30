namespace $.$$ {

	const { rem } = $mol_style_unit

	$mol_style_define( $bog_pazzle_menu, {

		display: 'flex',
		flexDirection: 'column',
		gap: $mol_gap.text,
		padding: $mol_gap.block,
		background: { color: $mol_theme.card },
		border: { radius: $mol_gap.round },
		boxShadow: `0 0 0 1px ${ $mol_theme.line }`,

		'>': {
			$mol_button: {
				justifyContent: 'flex-start',
				gap: $mol_gap.text,
				minHeight: rem( 2.5 ),
			},
		},

		'@media': {
			'(max-width: 45rem)': {
				flexDirection: 'row',
				flexWrap: 'wrap',
			},
		},

	} )

}
