namespace $.$$ {

	type $bog_pazzle_board_selection = {
		key: string
		picked: number | null
		from: number | null
		drag: readonly number[] | null
		drop: readonly number[] | null
	}

	export class $bog_pazzle_board extends $.$bog_pazzle_board {

		@ $mol_mem
		board_content(): readonly $mol_view[] {
			return this.image_uri() ? [ this.Field() ] : [ this.Placeholder() ]
		}

		@ $mol_mem
		field_content(): readonly $mol_view[] {
			const parts: $mol_view[] = [ this.Grid() ]
			if( this.peek() ) parts.push( this.Peek() )
			if( this.merged() ) parts.push( this.Victory() )
			return parts
		}

		@ $mol_mem
		tiles(): readonly $mol_view[] {
			return this.order().map( ( piece, slot )=> this.Tile( slot ) )
		}

		// ——— геометрия ———

		grid_w() { return Math.max( 1, this.columns() ) }
		grid_h() { return Math.max( 1, this.rows() ) }

		slot_row( slot: number ) { return Math.floor( slot / this.grid_w() ) }
		slot_col( slot: number ) { return slot % this.grid_w() }

		grid_columns() { return 'repeat(' + this.grid_w() + ', 1fr)' }
		grid_rows() { return 'repeat(' + this.grid_h() + ', 1fr)' }

		@ $mol_mem
		grid_ratio() {
			const size = this.image_size()
			return size ? size.width + ' / ' + size.height : ''
		}

		@ $mol_mem
		image_size() {
			const uri = this.image_uri()
			if( !uri ) return null
			return this.$.$mol_wire_sync( this ).image_load( uri )
		}

		async image_load( uri: string ) {
			const image = new this.$.$mol_dom_context.Image()
			image.src = uri
			await image.decode()
			return { width: image.naturalWidth, height: image.naturalHeight }
		}

		// ——— фрагменты ———

		tile_slot( slot: number ) { return slot }

		tile_piece( slot: number ) {
			return this.order()[ slot ] ?? slot
		}

		tile_label( slot: number ) {
			return this.numbers() ? String( this.tile_piece( slot ) + 1 ) : ''
		}

		tile_selected( slot: number ) {
			if( this.drop_slots()?.includes( slot ) ) return true
			if( this.drag_slots()?.includes( slot ) ) return true
			return this.picked() === slot
		}

		/** Уже сложенные соседи едут вместе — их drag-плагины цепляем к ведущему. */
		@ $mol_mem_key
		tile_synced( slot: number ): readonly $.$rise_drag[] {
			if( !this.playable() ) return []
			return this.group( slot )
				.filter( member => member !== slot )
				.map( member => this.Tile( member ).Drag() )
		}

		@ $mol_mem
		assembled() {
			return this.$.$bog_pazzle_store.assembled( this.order() )
		}

		/** Пазл сложен — швы смыкаются. В предпросмотре сетку, наоборот, показываем. */
		@ $mol_mem
		merged() {
			return this.playable() && this.assembled()
		}

		/** Высокая картинка иначе выпихивает доску за нижний край экрана. */
		@ $mol_mem
		field_width() {
			const size = this.image_size()
			if( !size || size.width >= size.height ) return ''
			return Math.round( 70 * size.width / size.height ) + 'vh'
		}

		// ——— группы сложенных фрагментов ———

		neighbors( slot: number ) {
			const near: number[] = []
			const columns = this.grid_w()
			const row = this.slot_row( slot )
			const col = this.slot_col( slot )
			if( col > 0 ) near.push( slot - 1 )
			if( col + 1 < columns ) near.push( slot + 1 )
			if( row > 0 ) near.push( slot - columns )
			if( row + 1 < this.grid_h() ) near.push( slot + columns )
			return near
		}

		/** Соседние клетки держат соседние куски картинки — значит, они уже склеены. */
		aligned( from: number, to: number, order: readonly number[] ) {

			const shift_row = this.slot_row( to ) - this.slot_row( from )
			const shift_col = this.slot_col( to ) - this.slot_col( from )
			if( Math.abs( shift_row ) + Math.abs( shift_col ) !== 1 ) return false

			const piece_from = order[ from ]
			const piece_to = order[ to ]
			if( piece_from === undefined || piece_to === undefined ) return false

			const columns = this.grid_w()
			return Math.floor( piece_to / columns ) - Math.floor( piece_from / columns ) === shift_row
				&& piece_to % columns - piece_from % columns === shift_col
		}

		@ $mol_mem
		groups() {

			const order = this.order()
			const groups = new Map< number, readonly number[] >()
			const seen = new Set< number >()

			for( let slot = 0; slot < order.length; slot ++ ) {

				if( seen.has( slot ) ) continue

				const group: number[] = []
				const stack = [ slot ]

				while( stack.length ) {
					const current = stack.pop()!
					if( seen.has( current ) ) continue
					seen.add( current )
					group.push( current )
					for( const near of this.neighbors( current ) ) {
						if( !seen.has( near ) && this.aligned( current, near, order ) ) stack.push( near )
					}
				}

				const frozen = Object.freeze( group.sort( ( a, b )=> a - b ) ) as readonly number[]
				for( const member of frozen ) groups.set( member, frozen )

			}

			return groups
		}

		group( slot: number ): readonly number[] {
			return this.groups().get( slot ) ?? [ slot ]
		}

		/** Кусок, стоящий на своём месте, больше не двигаем — он уже дома. */
		tile_locked( slot: number ) {
			const order = this.order()
			return this.group( slot ).every( member => order[ member ] === member )
		}

		// ——— состояние перетаскивания ———

		/** Смена картинки или сетки обесценивает всё выделенное. */
		reset_key() {
			return this.image_uri() + '|' + this.rows() + '|' + this.columns()
		}

		selection_blank(): $bog_pazzle_board_selection {
			return { key: '', picked: null, from: null, drag: null, drop: null }
		}

		/**
		 * Ячейка, в которую пишут: после записи её зависимости замерзают,
		 * поэтому ключ пазла кладём внутрь значения, а не читаем рядом.
		 */
		@ $mol_mem
		selection_raw( next?: $bog_pazzle_board_selection ) {
			if( next !== undefined ) return next
			return this.selection_blank()
		}

		/** Чтение сверяет ключ вживую — выделение от прошлого пазла не всплывёт. */
		selection(): $bog_pazzle_board_selection {
			const state = this.selection_raw()
			return state.key === this.reset_key() ? state : this.selection_blank()
		}

		select( patch: Partial< $bog_pazzle_board_selection > ) {
			this.selection_raw( { ... this.selection(), ... patch, key: this.reset_key() } )
		}

		picked() { return this.selection().picked }
		drag_from() { return this.selection().from }
		drag_slots() { return this.selection().drag }
		drop_slots() { return this.selection().drop }

		drag_reset() {
			this.select( { from: null, drag: null, drop: null } )
		}

		/** Возвращает все фрагменты на свои клетки после перетаскивания. */
		tiles_home() {
			for( let slot = 0; slot < this.order().length; slot ++ ) {
				const tile = this.Tile( slot )
				tile.x( 0 )
				tile.y( 0 )
			}
		}

		slot_at( x: number, y: number ) {

			const document = this.$.$mol_dom_context.document
			const element = document.elementFromPoint( x, y ) as HTMLElement | null
			const tile = element?.closest?.( '[data-pazzle-slot]' ) as HTMLElement | null

			if( tile ) {
				const slot = Number( tile.getAttribute( 'data-pazzle-slot' ) )
				if( Number.isFinite( slot ) ) return slot
			}

			const grid = this.Grid().dom_node() as HTMLElement | null
			if( !grid ) return null

			const rect = grid.getBoundingClientRect()
			if( x < rect.left || x > rect.right || y < rect.top || y > rect.bottom ) return null

			const columns = this.grid_w()
			const rows = this.grid_h()
			const col = Math.min( columns - 1, Math.max( 0, Math.floor( ( x - rect.left ) / ( rect.width / columns ) ) ) )
			const row = Math.min( rows - 1, Math.max( 0, Math.floor( ( y - rect.top ) / ( rect.height / rows ) ) ) )

			return row * columns + col
		}

		// ——— ходы ———

		@ $mol_action
		tile_press( slot: number, next?: PointerEvent | null ) {

			if( !this.playable() || this.tile_locked( slot ) ) {
				this.drag_reset()
				return null
			}

			const group = this.group( slot )
			this.select( { from: slot, drag: group, drop: group } )

			return null
		}

		@ $mol_action
		tile_drag( slot: number, next?: PointerEvent | null ) {

			const from = this.drag_from()
			if( from === null || slot !== from || !next ) return null

			const group = this.drag_slots() ?? [ from ]
			const over = this.slot_at( next.clientX, next.clientY )

			if( over === null ) {
				this.select( { drop: group } )
				return null
			}

			const shift_row = this.slot_row( over ) - this.slot_row( from )
			const shift_col = this.slot_col( over ) - this.slot_col( from )
			this.select( { drop: this.shifted( group, shift_row, shift_col ) ?? group } )

			return null
		}

		@ $mol_action
		tile_drop( slot: number, next?: PointerEvent | null ) {

			const from = this.drag_from()
			if( from === null || slot !== from ) {
				this.tiles_home()
				return null
			}

			const group = this.drag_slots() ?? [ from ]
			const dest = this.drop_slots()
			const moved = !!dest && dest.length === group.length && !this.same( group, dest )

			// перетаскивание отменяет выбор тапом, а тап по той же клетке — наоборот, его продолжает
			this.select( moved ? { from: null, drag: null, drop: null, picked: null } : { from: null, drag: null, drop: null } )
			this.tiles_home()

			if( moved ) {
				const order = this.shift_order( group, dest! )
				if( order ) this.commit( order )
			} else {
				this.pick( from )
			}

			return null
		}

		/** Тап без перетаскивания: первый выбирает фрагмент, второй меняет их местами. */
		@ $mol_action
		pick( slot: number ) {

			if( !this.playable() ) return

			if( this.tile_locked( slot ) ) {
				this.select( { picked: null } )
				return
			}

			const current = this.picked()

			if( current === null ) {
				this.select( { picked: slot } )
				return
			}

			if( current === slot || this.tile_locked( current ) ) {
				this.select( { picked: null } )
				return
			}

			const order = [ ... this.order() ]
			;[ order[ current ], order[ slot ] ] = [ order[ slot ], order[ current ] ]
			this.select( { picked: null } )
			this.commit( order )
		}

		commit( order: readonly number[] ) {
			this.apply( { order, moves: this.moves() + 1 } as $bog_pazzle_store_move )
		}

		/** Куда уедет группа при сдвиге на столько строк и столбцов. null — за край доски. */
		shifted( group: readonly number[], shift_row: number, shift_col: number ) {

			const columns = this.grid_w()
			const rows = this.grid_h()
			const dest: number[] = []
			const seen = new Set< number >()

			for( const slot of group ) {
				const row = this.slot_row( slot ) + shift_row
				const col = this.slot_col( slot ) + shift_col
				if( row < 0 || row >= rows || col < 0 || col >= columns ) return null
				const target = row * columns + col
				if( seen.has( target ) ) return null
				seen.add( target )
				dest.push( target )
			}

			return dest as readonly number[]
		}

		same( a: readonly number[], b: readonly number[] ) {
			return a.length === b.length && a.every( ( value, index )=> value === b[ index ] )
		}

		/** Группа встаёт на новые клетки, вытесненные фрагменты занимают освободившиеся. */
		shift_order( group: readonly number[], dest: readonly number[] ) {

			const order = this.order()
			const next = [ ... order ]
			const from_set = new Set( group )
			const to_set = new Set( dest )

			const evicted: number[] = []
			const vacant: number[] = []

			for( let index = 0; index < group.length; index ++ ) {
				const from = group[ index ]
				const to = dest[ index ]
				if( !from_set.has( to ) ) evicted.push( order[ to ] )
				if( !to_set.has( from ) ) vacant.push( from )
				next[ to ] = order[ from ]
			}

			if( evicted.length !== vacant.length ) return null

			for( let index = 0; index < vacant.length; index ++ ) {
				next[ vacant[ index ] ] = evicted[ index ]
			}

			return next as readonly number[]
		}

	}

}
