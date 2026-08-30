namespace $.$$ {

	const { rem } = $mol_style_unit

	$mol_style_define( $bog_pazzle_upload_image, {

		width: rem( 12 ),
		height: rem( 12 ),
		padding: 0,
		border: { radius: $mol_gap.round },
		background: { color: $mol_theme.field },
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		overflow: 'hidden',

		Preview: {
			width: '100%',
			height: '100%',
			maxWidth: '100%',
			objectFit: 'cover',
		},

		Icon: {
			width: rem( 3 ),
			height: rem( 3 ),
			color: $mol_theme.shade,
		},

		Native: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			opacity: 0,
			cursor: 'pointer',
		},

	} )

}
