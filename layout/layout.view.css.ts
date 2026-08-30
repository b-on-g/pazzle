namespace $.$$ {

	const { rem } = $mol_style_unit

	$mol_style_define( $bog_pazzle_layout, {

		display: 'flex',
		alignItems: 'flex-start',
		gap: $mol_gap.block,
		width: '100%',
		minWidth: 0,

		// меню и рабочая область приходят от корня, поэтому адресуем их по классу
		'>': {

			$bog_pazzle_menu: {
				flex: {
					basis: rem( 15 ),
					grow: 0,
					shrink: 0,
				},
			},

			$bog_pazzle_upload: {
				flex: {
					grow: 1,
					shrink: 1,
					basis: 0,
				},
				minWidth: 0,
			},

		},

		'@media': {
			'(max-width: 45rem)': {

				flexDirection: 'column',
				alignItems: 'stretch',

				'>': {
					$bog_pazzle_menu: {
						flex: {
							basis: 'auto',
						},
					},
				},

			},
		},

	} )

}
