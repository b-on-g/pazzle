namespace $.$$ {

	export class $bog_pazzle_board_victory extends $.$bog_pazzle_board_victory {

		stats() {
			return this.$.$bog_pazzle_store.moves_label( this.moves() ) + ' за ' + this.time()
		}

		@ $mol_mem
		card_content(): readonly $mol_view[] {
			const rows: $mol_view[] = [ this.Title(), this.Stats() ]
			if( this.best() ) rows.push( this.Best() )
			rows.push( this.Actions() )
			return rows
		}

	}

}
