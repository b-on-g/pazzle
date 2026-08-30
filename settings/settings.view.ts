namespace $.$$ {

	export class $bog_pazzle_settings extends $.$bog_pazzle_settings {

		sizes(): readonly number[] {
			return [ 3, 4, 5, 6 ]
		}

		@ $mol_mem
		presets(): readonly $mol_view[] {
			return this.sizes().map( size => this.Preset( size ) )
		}

		preset_title( size: number ) {
			return size + ' × ' + size
		}

		preset_current( size: number ) {
			return this.grid_rows() === size && this.grid_columns() === size
		}

		@ $mol_action
		preset_pick( size: number, next?: any ) {
			this.grid_rows( size )
			this.grid_columns( size )
			return null
		}

	}

}
