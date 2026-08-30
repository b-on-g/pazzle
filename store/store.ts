namespace $ {

	/** Партия: сетка, раскладка и статистика. Картинки лежат отдельными ключами — их незачем переписывать на каждый ход. */
	export type $bog_pazzle_store_save = {
		id: string
		rows: number
		columns: number
		numbers: boolean
		order: readonly number[]
		moves: number
		elapsed: number
		last_at: number
		solved: boolean
		best_moves: number
		best_elapsed: number
		created: number
		updated: number
	}

	/** Ход: новая раскладка и счётчик. Доска отдаёт это наверх одним куском. */
	export type $bog_pazzle_store_move = {
		order: readonly number[]
		moves: number
	}

	/** Партии и картинки в localStorage. */
	export class $bog_pazzle_store extends $mol_object {

		/** Больше партий не держим — localStorage не резиновый. */
		static limit = 8

		/** Пауза, после которой секундомер считается остановленным. */
		static idle = 30000

		/** Идентификатор черновика — партии, которую ещё не начали. */
		static draft = 'draft'

		static cell< Value >( key: string, next?: Value | null ) {
			return this.$.$mol_state_local.value< Value >( '$bog_pazzle.' + key, next )
		}

		static ids( next?: readonly string[] | null ) {
			return this.cell< readonly string[] >( 'ids', next ) ?? []
		}

		static save( id: string, next?: $bog_pazzle_store_save | null ) {
			if( !id ) return null
			return this.cell< $bog_pazzle_store_save >( 'save.' + id, next )
		}

		static image( id: string, next?: string | null ) {
			if( !id ) return ''
			return this.cell< string >( 'image.' + id, next ) ?? ''
		}

		static thumb( id: string, next?: string | null ) {
			if( !id ) return ''
			return this.cell< string >( 'thumb.' + id, next ) ?? ''
		}

		/** Партия, которую открывает экран игры. */
		static current( next?: string | null ) {
			return this.cell< string >( 'current', next ) ?? ''
		}

		static patch( id: string, patch: Partial< $bog_pazzle_store_save > ) {
			const prev = this.save( id )
			if( !prev ) return null
			return this.save( id, { ... prev, ... patch, updated: Date.now() } )
		}

		static blank( id: string, rows: number, columns: number, numbers: boolean ): $bog_pazzle_store_save {
			const now = Date.now()
			return {
				id,
				rows,
				columns,
				numbers,
				order: this.shuffled( rows * columns ),
				moves: 0,
				elapsed: 0,
				last_at: 0,
				solved: false,
				best_moves: 0,
				best_elapsed: 0,
				created: now,
				updated: now,
			}
		}

		/** Кладёт черновик в список партий под свежим идентификатором и делает его текущим. */
		static start() {

			const draft = this.save( this.draft )
			if( !draft || !this.image( this.draft ) ) return ''

			const id = Date.now().toString( 36 ) + Math.random().toString( 36 ).slice( 2, 7 )

			this.spacious( ()=> {
				this.image( id, this.image( this.draft ) )
				this.thumb( id, this.thumb( this.draft ) )
				this.save( id, this.blank( id, draft.rows, draft.columns, draft.numbers ) )
			} )

			const kept = [ id, ... this.ids().filter( item => item !== id ) ]
			for( const dropped of kept.slice( this.limit ) ) this.forget( dropped )
			this.ids( kept.slice( 0, this.limit ) )
			this.current( id )

			return id
		}

		/** Хранилище кончилось — сносим самую старую партию и пробуем ещё раз. */
		static spacious( write: ()=> void ) {
			for( let attempt = 0; ; attempt ++ ) {
				try {
					return write()
				} catch( error ) {
					const ids = this.ids()
					if( attempt >= this.limit || !ids.length ) return $mol_fail( error as Error )
					this.drop( ids[ ids.length - 1 ] )
				}
			}
		}

		static forget( id: string ) {
			this.save( id, null )
			this.image( id, null )
			this.thumb( id, null )
		}

		static drop( id: string ) {
			this.forget( id )
			this.ids( this.ids().filter( item => item !== id ) )
			if( this.current() === id ) this.current( null )
		}

		static shuffled( count: number ) {
			const order = Array.from( { length: count }, ( _, index )=> index )
			for( let index = order.length - 1; index > 0; index -- ) {
				const swap = Math.floor( Math.random() * ( index + 1 ) )
				;[ order[ index ], order[ swap ] ] = [ order[ swap ], order[ index ] ]
			}
			if( count > 1 && this.assembled( order ) ) {
				;[ order[ 0 ], order[ 1 ] ] = [ order[ 1 ], order[ 0 ] ]
			}
			return order as readonly number[]
		}

		static assembled( order: readonly number[] ) {
			return order.length > 0 && order.every( ( piece, slot )=> piece === slot )
		}

		/** Сколько секундомер натикал с последнего хода. Долгая пауза не идёт в зачёт. */
		static gap( save: $bog_pazzle_store_save | null, now: number ) {
			if( !save || save.solved || !save.last_at ) return 0
			const gap = now - save.last_at
			return gap > 0 && gap < this.idle ? gap : 0
		}

		static clock( ms: number ) {
			const total = Math.max( 0, Math.floor( ms / 1000 ) )
			const minutes = Math.floor( total / 60 )
			const seconds = total % 60
			return minutes + ':' + String( seconds ).padStart( 2, '0' )
		}

		/** «1 ход», «2 хода», «5 ходов». */
		static moves_label( count: number ) {
			const tail = count % 100
			const last = count % 10
			if( tail > 10 && tail < 20 ) return count + ' ходов'
			if( last === 1 ) return count + ' ход'
			if( last >= 2 && last <= 4 ) return count + ' хода'
			return count + ' ходов'
		}

		static day( stamp: number ) {
			return new Date( stamp ).toLocaleDateString( 'ru-RU', { day: 'numeric', month: 'short' } )
		}

	}

}
