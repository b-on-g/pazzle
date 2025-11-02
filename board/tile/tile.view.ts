namespace $.$$ {
	export class $bog_pazzle_board_tile extends $.$bog_pazzle_board_tile {
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

		@$mol_mem
		piece_row(next?: number) {
			return next ?? 0
		}

		@$mol_mem
		piece_column(next?: number) {
			return next ?? 0
		}

		@$mol_mem
		selected(next?: boolean) {
			return next ?? false
		}

		@$mol_mem
		label(next?: string) {
			return next ?? ''
		}

			override style() {
			const rows = Math.max(1, this.rows())
			const columns = Math.max(1, this.columns())
			const tile_row = this.piece_row()
			const tile_column = this.piece_column()
			const uri = this.image_uri()

			const pos_x = columns === 1 ? 0 : (tile_column / (columns - 1)) * 100
			const pos_y = rows === 1 ? 0 : (tile_row / (rows - 1)) * 100

			const style = { ...super.style() } as Record<string, string | number>
			style.backgroundImage = uri ? `url(${uri})` : ''
			style.backgroundSize = uri ? `${columns * 100}% ${rows * 100}%` : ''
			style.backgroundPosition = uri ? `${pos_x}% ${pos_y}%` : ''
			style.boxShadow = this.selected()
				? 'inset 0 0 0 3px rgba(255,255,255,0.75)'
				: 'inset 0 0 0 1px var(--mol_theme_line)'
			return style
		}
	}
}
