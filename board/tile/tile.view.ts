namespace $.$$ {
	export class $bog_pazzle_board_tile extends $.$bog_pazzle_board_tile {
		@$mol_mem
		row(next?: number) {
			return next ?? 0
		}

		@$mol_mem
		column(next?: number) {
			return next ?? 0
		}

		@$mol_mem
		rows(next?: number) {
			return next ?? 1
		}

		@$mol_mem
		columns(next?: number) {
			return next ?? 1
		}

		@$mol_mem
		image_uri(next?: string) {
			return next ?? ''
		}

		override style() {
			const rows = Math.max(1, this.rows())
			const columns = Math.max(1, this.columns())
			const row = this.row()
			const column = this.column()
			const uri = this.image_uri()

			const pos_x = columns === 1 ? 0 : (column / (columns - 1)) * 100
			const pos_y = rows === 1 ? 0 : (row / (rows - 1)) * 100

			const style = { ...super.style() } as Record<string, string | number>
			style.backgroundImage = uri ? `url(${uri})` : ''
			style.backgroundSize = uri ? `${columns * 100}% ${rows * 100}%` : ''
			style.backgroundPosition = uri ? `${pos_x}% ${pos_y}%` : ''
			return style
		}
	}
}
