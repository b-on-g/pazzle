namespace $.$$ {
	export class $bog_pazzle_board extends $.$bog_pazzle_board {
		@$mol_mem
		override sub() {
			return this.image_present() ? [this.Grid()] : [this.Placeholder()]
		}

		Grid() {
			const grid = super.Grid()
			grid.sub = () => this.tiles()
			return grid
		}

		@$mol_mem
		image_present() {
			return !!this.image_uri()
		}

		@$mol_mem
		tiles(): readonly $mol_view[] {
			if (!this.image_present()) return []

			const rows = Math.max(1, this.rows())
			const columns = Math.max(1, this.columns())
			const uri = this.image_uri()

			const tiles: $mol_view[] = []
			for (let row = 0; row < rows; row++) {
				for (let column = 0; column < columns; column++) {
					tiles.push(this.tile(row, column, rows, columns, uri))
				}
			}
			return tiles
		}

		tile(row: number, column: number, rows: number, columns: number, uri: string) {
			return this.$.$bog_pazzle_board_tile.make({
				row: () => row,
				column: () => column,
				rows: () => rows,
				columns: () => columns,
				image_uri: () => uri,
			})
		}

		grid_template_columns() {
			return `repeat(${Math.max(1, this.columns())}, 1fr)`
		}

		grid_template_rows() {
			return `repeat(${Math.max(1, this.rows())}, 1fr)`
		}
	}
}
