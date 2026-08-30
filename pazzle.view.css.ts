namespace $.$$ {

	const { rem } = $mol_style_unit

	$mol_style_define( $bog_pazzle, {

		Body_content: {
			maxWidth: rem( 60 ),
			width: '100%',
			margin: {
				left: 'auto',
				right: 'auto',
			},
			gap: $mol_gap.block,
		},

		Back: {
			flex: {
				grow: 0,
				shrink: 0,
			},
			alignSelf: 'center',
		},

	} )

}
