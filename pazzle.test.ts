namespace $ {

	/** Методы доски живут в `$$`, поэтому тип берём оттуда же. */
	function board( rows: number, columns: number, order: readonly number[] ) {
		const game = new $bog_pazzle_board as $$.$bog_pazzle_board
		game.rows = ()=> rows
		game.columns = ()=> columns
		game.order = ()=> order
		game.playable = ()=> true
		return game
	}

	$mol_test( {

		'перемешивание никогда не выдаёт собранный порядок'() {
			for( let attempt = 0; attempt < 200; attempt ++ ) {
				const order = $bog_pazzle_store.shuffled( 4 )
				$mol_assert_equal( order.length, 4 )
				$mol_assert_equal( [ ... order ].sort().join(), '0,1,2,3' )
				$mol_assert_not( $bog_pazzle_store.assembled( order ) )
			}
		},

		'сетка из одной клетки собрана сразу'() {
			$mol_assert_ok( $bog_pazzle_store.assembled( $bog_pazzle_store.shuffled( 1 ) ) )
			$mol_assert_not( $bog_pazzle_store.assembled( [] ) )
		},

		'секундомер не считает долгую паузу'() {
			const now = 1_000_000
			const save = $bog_pazzle_store.blank( 'x', 2, 2, true )

			$mol_assert_equal( $bog_pazzle_store.gap( { ... save, last_at: 0 }, now ), 0 )
			$mol_assert_equal( $bog_pazzle_store.gap( { ... save, last_at: now - 3000 }, now ), 3000 )
			$mol_assert_equal( $bog_pazzle_store.gap( { ... save, last_at: now - 60_000 }, now ), 0 )
			$mol_assert_equal( $bog_pazzle_store.gap( { ... save, last_at: now - 1000, solved: true }, now ), 0 )
		},

		'время и ходы по-русски'() {
			$mol_assert_equal( $bog_pazzle_store.clock( 0 ), '0:00' )
			$mol_assert_equal( $bog_pazzle_store.clock( 61_000 ), '1:01' )
			$mol_assert_equal( $bog_pazzle_store.clock( 3_599_000 ), '59:59' )
			$mol_assert_equal( $bog_pazzle_store.moves_label( 1 ), '1 ход' )
			$mol_assert_equal( $bog_pazzle_store.moves_label( 3 ), '3 хода' )
			$mol_assert_equal( $bog_pazzle_store.moves_label( 11 ), '11 ходов' )
			$mol_assert_equal( $bog_pazzle_store.moves_label( 21 ), '21 ход' )
			$mol_assert_equal( $bog_pazzle_store.moves_label( 112 ), '112 ходов' )
		},

		'обмен двух фрагментов'() {
			const game = board( 2, 2, [ 3, 1, 2, 0 ] )
			$mol_assert_equal( game.shift_order( [ 0 ], [ 3 ] )?.join(), '0,1,2,3' )
		},

		'группа не выезжает за край'() {
			const game = board( 2, 2, [ 0, 1, 2, 3 ] )
			$mol_assert_equal( game.shifted( [ 0, 1 ], -1, 0 ), null )
			$mol_assert_equal( game.shifted( [ 0, 1 ], 1, 0 )?.join(), '2,3' )
		},

		'сдвиг группы вытесняет соседей'() {
			// верхняя строка уже сложена, нижняя перевёрнута
			const game = board( 2, 2, [ 0, 1, 3, 2 ] )
			const dest = game.shifted( [ 0, 1 ], 1, 0 )!
			$mol_assert_equal( game.shift_order( [ 0, 1 ], dest )?.join(), '3,2,0,1' )
		},

		'соседние куски картинки склеиваются в группу'() {
			const game = board( 2, 2, [ 0, 1, 3, 2 ] )
			$mol_assert_equal( game.group( 0 ).join(), '0,1' )
			$mol_assert_equal( game.group( 2 ).join(), '2' )
			$mol_assert_ok( game.tile_locked( 0 ) )
			$mol_assert_not( game.tile_locked( 2 ) )
		},

		'куски, лежащие рядом, но не на своих местах, тоже группа'() {
			// 2 и 3 стоят рядом в правильном порядке, но на чужой строке
			const game = board( 2, 2, [ 2, 3, 0, 1 ] )
			$mol_assert_equal( game.group( 0 ).join(), '0,1' )
			$mol_assert_not( game.tile_locked( 0 ) )
		},

	} )

}
