namespace $.$$ {

	export class $bog_pazzle_menu extends $.$bog_pazzle_menu {

		@ $mol_mem
		menu_content(): readonly $mol_view[] {
			const rows: $mol_view[] = []
			if( this.resumable() ) rows.push( this.Resume() )
			rows.push( this.New(), this.Saves(), this.Help() )
			return rows
		}

		saves_label() {
			const count = this.saves_count()
			return count ? 'Мои пазлы · ' + count : 'Мои пазлы'
		}

	}

}
