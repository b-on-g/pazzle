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

		@$mol_mem
		slot_index(next?: number) {
			return next ?? 0
		}

		repos_x(delta: number) {
			return this.limit_delta(delta)
		}

		repos_y(delta: number) {
			return this.limit_delta(delta)
		}

		limit_delta(delta: number) {
			const max = this.drag_limit()
			if (!Number.isFinite(max) || max <= 0) return delta
			return Math.max(-max, Math.min(max, delta))
		}

		drag_limit() {
			const rows = Math.max(1, this.rows())
			const columns = Math.max(1, this.columns())
			const min_dimension = Math.min(rows, columns)
			if (min_dimension <= 0) return Number.POSITIVE_INFINITY
			const base = Math.min(this.cell_size_px().width, this.cell_size_px().height)
			if (!base) return Number.POSITIVE_INFINITY
			return base * 0.8
		}

		cell_size_px() {
			const grid = this.host_grid()
			if (!grid) return { width: 0, height: 0 }
			const rect = grid.getBoundingClientRect()
			const rows = Math.max(1, this.rows())
			const columns = Math.max(1, this.columns())
			return {
				width: rect.width / columns,
				height: rect.height / rows,
			}
		}

		host_grid() {
			const element = this.dom_node()
			return element?.parentElement
		}

		override style() {
			const rows = Math.max(1, this.rows())
			const columns = Math.max(1, this.columns())
			const tile_row = this.piece_row()
			const tile_column = this.piece_column()
			const uri = this.image_uri()
			const offset_x = this.x()
			const offset_y = this.y()

			const pos_x = columns === 1 ? 0 : (tile_column / (columns - 1)) * 100
			const pos_y = rows === 1 ? 0 : (tile_row / (rows - 1)) * 100

			const style = super.style()
			style.backgroundImage = uri ? `url(${uri})` : ''
			style.backgroundSize = uri ? `${columns * 100}% ${rows * 100}%` : ''
			style.backgroundPosition = uri ? `${pos_x}% ${pos_y}%` : ''
			style.boxShadow = this.selected()
				? 'inset 0 0 0 3px rgba(255,255,255,0.75)'
				: 'inset 0 0 0 1px var(--mol_theme_line)'
			style.transform = offset_x || offset_y ? `translate(${offset_x}px, ${offset_y}px)` : ''
			style.zIndex = this.dragged() ? 10 : ''
			style.cursor = this.dragged() ? 'grabbing' : 'grab'
			style.pointerEvents = this.dragged() ? 'none' : ''
			return style
		}

		override attr() {
			return {
				...super.attr(),
				'data-bog-pazzle-slot': String(this.slot_index()),
				'data-selected': this.selected() ? 'true' : 'false',
				'data-dragging': this.dragged() ? 'true' : 'false',
			}
		}
	}
}
