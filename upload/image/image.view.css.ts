namespace $.$$ {
	$mol_style_define($bog_pazzle_upload_image, {
		width: '12rem',
		height: '12rem',
		padding: 0,
		border: { radius: $mol_gap.round },
		background: { color: $mol_theme.card },
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		overflow: 'hidden',

		$mol_image: {
			width: '100%',
			height: '100%',
			maxWidth: '100%',
			objectFit: 'cover',
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

		Placeholder: {
			width: '48px',
			height: '48px',
		},
	})
}
