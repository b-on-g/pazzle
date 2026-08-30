namespace $.$$ {

	export class $bog_pazzle extends $.$bog_pazzle {

		/** Экран берём из адреса, но на игру пускаем, только если партия жива. */
		@ $mol_mem
		mode() {
			const mode = this.$.$mol_state_arg.value( 'mode' ) ?? ''
			if( mode === 'play' && !this.image() ) return ''
			if( mode !== 'play' && mode !== 'saves' && mode !== 'help' ) return ''
			return mode
		}

		@ $mol_mem
		screen(): readonly $mol_view[] {
			switch( this.mode() ) {
				case 'play': return [ this.Play() ]
				case 'saves': return [ this.Saves() ]
				case 'help': return [ this.Help() ]
				default: return [ this.Home() ]
			}
		}

		caption() {
			switch( this.mode() ) {
				case 'play': return this.rows() + ' × ' + this.columns()
				case 'saves': return 'Мои пазлы'
				case 'help': return 'Как играть'
				default: return 'Пазл'
			}
		}

		@ $mol_mem
		override head(): readonly $mol_view[] {
			return this.mode()
				? [ this.Back(), this.Title(), this.Tools() ]
				: [ this.Title(), this.Tools() ]
		}

		// ——— навигация ———

		@ $mol_action
		go_home( next?: any ) {
			this.$.$mol_state_arg.go( { mode: null } )
			return null
		}

		@ $mol_action
		go_play( next?: any ) {
			this.$.$mol_state_arg.go( { mode: 'play' } )
			return null
		}

		@ $mol_action
		go_saves( next?: any ) {
			this.$.$mol_state_arg.go( { mode: 'saves' } )
			return null
		}

		@ $mol_action
		go_help( next?: any ) {
			this.$.$mol_state_arg.go( { mode: 'help' } )
			return null
		}

		// ——— текущая партия ———

		save() {
			const store = this.$.$bog_pazzle_store
			return store.save( store.current() )
		}

		image() {
			const store = this.$.$bog_pazzle_store
			return store.image( store.current() )
		}

		override rows() { return this.save()?.rows ?? 1 }
		override columns() { return this.save()?.columns ?? 1 }
		override numbers() { return this.save()?.numbers ?? false }
		override moves() { return this.save()?.moves ?? 0 }

		order(): readonly number[] {
			return this.save()?.order ?? []
		}

		/** Пока партия идёт, секундомер тикает раз в секунду. */
		@ $mol_mem
		elapsed() {
			const save = this.save()
			if( !save ) return 0
			const store = this.$.$bog_pazzle_store
			if( save.solved || !save.last_at ) return save.elapsed
			return save.elapsed + store.gap( save, this.$.$mol_state_time.now( 1000 ) )
		}

		time() {
			return this.$.$bog_pazzle_store.clock( this.elapsed() )
		}

		best() {
			const save = this.save()
			if( !save?.best_moves ) return ''
			const store = this.$.$bog_pazzle_store
			return 'Лучшее: ' + store.moves_label( save.best_moves ) + ' за ' + store.clock( save.best_elapsed )
		}

		/** Доска сходила — сохраняем раскладку, добираем время и обновляем рекорд. */
		@ $mol_action
		move( next?: $bog_pazzle_store_move | null ) {

			if( !next ) return null

			const store = this.$.$bog_pazzle_store
			const id = store.current()
			const save = store.save( id )
			if( !save ) return null

			const now = Date.now()
			const elapsed = save.elapsed + store.gap( save, now )
			const solved = store.assembled( next.order )
			const record = solved && ( !save.best_moves || next.moves < save.best_moves )

			store.patch( id, {
				order: next.order,
				moves: next.moves,
				elapsed,
				last_at: solved ? 0 : now,
				solved,
				best_moves: record ? next.moves : save.best_moves,
				best_elapsed: record ? elapsed : save.best_elapsed,
			} )

			return next
		}

		@ $mol_action
		again( next?: any ) {

			const store = this.$.$bog_pazzle_store
			const id = store.current()
			const save = store.save( id )
			if( !save ) return null

			store.patch( id, {
				order: store.shuffled( save.rows * save.columns ),
				moves: 0,
				elapsed: 0,
				last_at: 0,
				solved: false,
			} )
			this.peek( false )

			return null
		}

		@ $mol_action
		open( next?: string | null ) {
			if( !next ) return null
			this.$.$bog_pazzle_store.current( next )
			this.peek( false )
			this.go_play()
			return next
		}

		// ——— черновик новой партии ———

		draft() {
			const store = this.$.$bog_pazzle_store
			return store.save( store.draft )
		}

		draft_image() {
			const store = this.$.$bog_pazzle_store
			return store.image( store.draft )
		}

		draft_rows( next?: number ) {
			if( next === undefined ) return this.draft()?.rows ?? 4
			this.draft_patch( { rows: next } )
			return next
		}

		draft_columns( next?: number ) {
			if( next === undefined ) return this.draft()?.columns ?? 4
			this.draft_patch( { columns: next } )
			return next
		}

		draft_numbers( next?: boolean ) {
			if( next === undefined ) return this.draft()?.numbers ?? true
			this.draft_patch( { numbers: next } )
			return next
		}

		/** Предпросмотр показывает картинку целой — раскладка тут по порядку. */
		@ $mol_mem
		draft_order(): readonly number[] {
			const count = Math.max( 1, this.draft_rows() ) * Math.max( 1, this.draft_columns() )
			return Array.from( { length: count }, ( _, index )=> index )
		}

		@ $mol_action
		draft_patch( patch: Partial< $bog_pazzle_store_save > ) {
			const store = this.$.$bog_pazzle_store
			const prev = this.draft() ?? store.blank( store.draft, 4, 4, true )
			store.save( store.draft, { ... prev, ... patch, updated: Date.now() } )
		}

		@ $mol_action
		draft_picked( next?: File | null ) {

			if( !next ) return null

			const store = this.$.$bog_pazzle_store
			const pic = this.$.$mol_wire_sync( this.$ ).$bog_pazzle_pic_make( next )

			store.spacious( ()=> {
				store.image( store.draft, pic.image )
				store.thumb( store.draft, pic.thumb )
			} )
			this.draft_patch( {} )

			return next
		}

		@ $mol_action
		start( next?: any ) {
			if( this.$.$bog_pazzle_store.start() ) {
				this.peek( false )
				this.go_play()
			}
			return null
		}

		// ——— меню ———

		resumable() {
			const save = this.save()
			return !!save && !!this.image() && !save.solved
		}

		saves_count() {
			return this.$.$bog_pazzle_store.ids().length
		}

	}

}
