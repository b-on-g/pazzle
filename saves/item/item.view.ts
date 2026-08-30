namespace $.$$ {

	export class $bog_pazzle_saves_item extends $.$bog_pazzle_saves_item {

		save() {
			return this.$.$bog_pazzle_store.save( this.id() )
		}

		thumb() {
			return this.$.$bog_pazzle_store.thumb( this.id() )
		}

		label() {
			const save = this.save()
			if( !save ) return ''
			return save.rows + ' × ' + save.columns + ' · ' + this.$.$bog_pazzle_store.day( save.created )
		}

		stat() {
			const save = this.save()
			if( !save ) return ''
			const store = this.$.$bog_pazzle_store
			const done = store.moves_label( save.moves ) + ' за ' + store.clock( save.elapsed )
			return save.solved ? 'Собран · ' + done : 'В процессе · ' + done
		}

		@ $mol_action
		open_click( next?: any ) {
			this.open( this.id() )
			return null
		}

		drop_hint() {
			return this.confirm() ? 'Нажмите ещё раз, чтобы удалить' : 'Удалить'
		}

		/** Удаление в два клика — случайно снести собранный пазл обидно. */
		@ $mol_action
		drop_click( next?: any ) {
			if( !this.confirm() ) {
				this.confirm( true )
				return null
			}
			this.confirm( false )
			this.drop( this.id() )
			return null
		}

	}

}
