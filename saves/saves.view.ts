namespace $.$$ {

	export class $bog_pazzle_saves extends $.$bog_pazzle_saves {

		/** Битые записи в список не пускаем — иначе получится карточка-призрак. */
		ids(): readonly string[] {
			const store = this.$.$bog_pazzle_store
			return store.ids().filter( id => !!store.save( id ) )
		}

		row_id( id: string ) { return id }

		@ $mol_mem
		saves_content(): readonly $mol_view[] {
			const ids = this.ids()
			if( !ids.length ) return [ this.Empty(), this.Create() ]
			return [ ... ids.map( id => this.Row( id ) ), this.Create() ]
		}

		@ $mol_action
		drop( next?: string | null ) {
			if( next ) this.$.$bog_pazzle_store.drop( next )
			return next
		}

	}

}
