namespace $.$$ {
	export class $bog_pazzle_board extends $.$bog_pazzle_board {
		@$mol_mem
		override sub() {
			if (!this.image_present()) return [this.Placeholder()]
			return [this.Controls(), this.Grid()]
		}

		Grid() {
			const grid = super.Grid()
			grid.sub = () => this.tiles()
			return grid
		}

		Controls() {
			const controls = super.Controls()
			controls.sub = () => [
				this.Status_text(),
				this.Moves_text(),
				...(this.tile_count() > 1 ? [this.Shuffle_btn(), this.Reset_btn()] : []),
			]
			return controls
		}

		Status_text() {
			const $ = this.$
			return $.$mol_text.make({
				text: () => (this.solved() ? 'Собрано! 🎉' : 'Соберите пазл'),
			})
		}

		Moves_text() {
			const $ = this.$
			return $.$mol_text.make({
				text: () => `Ходов: ${this.moves()}`,
			})
		}

		Shuffle_btn() {
			const $ = this.$
			return $.$mol_button_minor.make({
				sub: () => [$.$mol_text.make({ text: () => 'Перемешать' })],
				click: () => this.shuffle(),
				enabled: () => this.tile_count() > 1,
			})
		}

		Reset_btn() {
			const $ = this.$
			return $.$mol_button_minor.make({
				sub: () => [$.$mol_text.make({ text: () => 'Сбросить' })],
				click: () => this.reset(),
				enabled: () => !this.solved() && this.tile_count() > 1,
			})
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
			const order = this.tile_indices()
			const uri = this.image_uri()

			return order.map((piece_index, slot_index) => {
				const piece_row = Math.floor(piece_index / columns)
				const piece_column = piece_index % columns
				return this.tile({
					slot_index,
					piece_row,
					piece_column,
					rows,
					columns,
					uri,
					piece_index,
				})
			})
		}

		tile({
			slot_index,
			piece_row,
			piece_column,
			rows,
			columns,
			uri,
			piece_index,
		}: {
			slot_index: number
			piece_row: number
			piece_column: number
			rows: number
			columns: number
			uri: string
			piece_index: number
		}) {
			const tile = this.tile_instance(slot_index)
			tile.rows(rows)
			tile.columns(columns)
			tile.piece_row(piece_row)
			tile.piece_column(piece_column)
			tile.image_uri(uri)
			tile.slot_index(slot_index)
			tile.label(this.show_numbers() ? String(piece_index + 1) : '')
			tile.selected(this.tile_marked(slot_index))
			tile.event_click(() => this.tile_pick(slot_index))
			tile.on_drag_start((event: PointerEvent) => this.tile_drag_start(slot_index, event))
			tile.on_drag((event: PointerEvent) => this.tile_drag_move(slot_index, event))
			tile.on_drag_end((event: PointerEvent) => this.tile_drag_end(slot_index, event))
			return tile
		}

		tile_instance(slot_index: number) {
			const $ = this.$
			return $.$bog_pazzle_board_tile.make({
				slot_index: $.$mol_const(slot_index),
			})
		}

		tile_marked(slot_index: number) {
			const selected = this.selected_index()
			const drag_source = this.drag_source_index()
			const drag_hover = this.drag_hover_index()
			if (drag_source !== null && drag_source === slot_index) return true
			if (drag_hover !== null && drag_hover === slot_index && drag_source !== null) return true
			return selected !== null && selected === slot_index
		}

		@$mol_mem
		drag_source_index(next?: number | null) {
			this.rows()
			this.columns()
			this.image_uri()
			if (next !== undefined) return next
			return null
		}

		@$mol_mem
		drag_hover_index(next?: number | null) {
			this.rows()
			this.columns()
			this.image_uri()
			if (next !== undefined) return next
			return null
		}

		slot_index_from_point(client_x: number | undefined, client_y: number | undefined) {
			if (client_x === undefined || client_y === undefined) return null
			const doc = this.$.$mol_dom_context.document
			const element = doc.elementFromPoint(client_x, client_y) as HTMLElement | null
			const tile = element?.closest?.('[data-bog-pazzle-slot]') as HTMLElement | null
			if (tile) {
				const slot = Number(tile.getAttribute('data-bog-pazzle-slot'))
				if (Number.isFinite(slot)) return slot
			}

			const grid = this.Grid().dom_node() as HTMLElement | null
			if (!grid) return null
			const rect = grid.getBoundingClientRect()
			if (client_x < rect.left || client_x > rect.right || client_y < rect.top || client_y > rect.bottom)
				return null

			const rel_x = client_x - rect.left
			const rel_y = client_y - rect.top
			const columns = Math.max(1, this.columns())
			const rows = Math.max(1, this.rows())
			const cell_width = rect.width / columns
			const cell_height = rect.height / rows

			const column = Math.min(columns - 1, Math.max(0, Math.floor(rel_x / cell_width)))
			const row = Math.min(rows - 1, Math.max(0, Math.floor(rel_y / cell_height)))
			return row * columns + column
		}

		reset_tile_position(slot_index: number) {
			const tile = this.tile_instance(slot_index)
			tile.x(0)
			tile.y(0)
		}

		@$mol_action
		tile_drag_start(slot_index: number, _event: PointerEvent) {
			this.drag_source_index(slot_index)
			this.drag_hover_index(slot_index)
			this.selected_index(slot_index)
		}

		@$mol_action
		tile_drag_move(_slot_index: number, event: PointerEvent) {
			if (this.drag_source_index() === null) return
			const hover = this.slot_index_from_point(event.clientX, event.clientY)
			this.drag_hover_index(hover ?? this.drag_source_index())
		}

		@$mol_action
		tile_drag_end(slot_index: number, event: PointerEvent) {
			const source = this.drag_source_index()
			this.reset_tile_position(slot_index)
			const target = this.slot_index_from_point(event.clientX, event.clientY)
			if (source !== null && target !== null && target !== source) {
				const order = [...this.tile_indices()]
				;[order[source], order[target]] = [order[target], order[source]]
				this.tile_indices(order)
				this.moves(this.moves() + 1)
			}
			this.selected_index(null)
			this.drag_source_index(null)
			this.drag_hover_index(null)
		}

		@$mol_mem
		tile_indices(next?: readonly number[]) {
			const rows = Math.max(1, this.rows())
			const columns = Math.max(1, this.columns())
			const count = rows * columns
			const image = this.image_uri()
			const should_shuffle = this.shuffle_enabled()
			if (!image || count === 0) return []
			if (next !== undefined) return next
			const base = this.indices_default(count)
			if (!should_shuffle || count < 2) return base
			return this.shuffle_with_seed(base, this.seed_from_string(`${image}|${rows}|${columns}`))
		}

		indices_default(count: number) {
			return Array.from({ length: count }, (_, index) => index)
		}

		shuffle_with_seed(base: readonly number[], seed: number) {
			const order = [...base]
			let value = seed >>> 0
			for (let index = order.length - 1; index > 0; index--) {
				value = (value * 1664525 + 1013904223) >>> 0
				const swap = value % (index + 1)
				;[order[index], order[swap]] = [order[swap], order[index]]
			}
			if (this.is_order_solved(order) && order.length > 1) {
				;[order[0], order[1]] = [order[1], order[0]]
			}
			return order
		}

		seed_from_string(source: string) {
			let seed = 0
			for (let index = 0; index < source.length; index++) {
				seed = (seed * 31 + source.charCodeAt(index)) >>> 0
			}
			return seed || 1
		}

		@$mol_mem
		selected_index(next?: number | null) {
			this.rows()
			this.columns()
			this.image_uri()
			if (next !== undefined) return next
			return null
		}

		@$mol_mem
		moves(next?: number) {
			this.rows()
			this.columns()
			this.image_uri()
			if (next !== undefined) return next
			return 0
		}

		tile_count() {
			return Math.max(1, this.rows()) * Math.max(1, this.columns())
		}

		is_order_solved(order: readonly number[]) {
			return order.every((value, index) => value === index)
		}

		@$mol_mem
		solved() {
			const order = this.tile_indices()
			return this.is_order_solved(order)
		}

		@$mol_action
		tile_pick(slot_index: number) {
			this.drag_source_index(null)
			this.drag_hover_index(null)
			const current = this.selected_index()
			if (current === null) {
				this.selected_index(slot_index)
				return
			}
			if (current === slot_index) {
				this.selected_index(null)
				return
			}
			const order = [...this.tile_indices()]
			;[order[current], order[slot_index]] = [order[slot_index], order[current]]
			this.tile_indices(order)
			this.moves(this.moves() + 1)
			this.selected_index(null)
		}

		@$mol_action
		shuffle() {
			const order = this.shuffle_random(this.tile_indices())
			this.tile_indices(order)
			this.moves(0)
			this.selected_index(null)
			this.drag_source_index(null)
			this.drag_hover_index(null)
			this.reset_all_tile_positions()
		}

		shuffle_random(base: readonly number[]) {
			const order = [...base]
			for (let index = order.length - 1; index > 0; index--) {
				const swap = Math.floor(Math.random() * (index + 1))
				;[order[index], order[swap]] = [order[swap], order[index]]
			}
			if (this.is_order_solved(order) && order.length > 1) {
				;[order[0], order[1]] = [order[1], order[0]]
			}
			return order
		}

		@$mol_action
		reset() {
			const rows = Math.max(1, this.rows())
			const columns = Math.max(1, this.columns())
			this.tile_indices(this.indices_default(rows * columns))
			this.moves(0)
			this.selected_index(null)
			this.drag_source_index(null)
			this.drag_hover_index(null)
			this.reset_all_tile_positions()
		}

		reset_all_tile_positions() {
			const total = this.tile_count()
			for (let slot = 0; slot < total; slot++) {
				this.reset_tile_position(slot)
			}
		}

		grid_template_columns() {
			return `repeat(${Math.max(1, this.columns())}, 1fr)`
		}

		grid_template_rows() {
			return `repeat(${Math.max(1, this.rows())}, 1fr)`
		}
	}
}
