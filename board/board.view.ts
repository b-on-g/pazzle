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
				...this.tile_count() > 1 ? [this.Shuffle_btn(), this.Reset_btn()] : [],
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
			return this.$.$bog_pazzle_board_tile.make({
				rows: () => rows,
				columns: () => columns,
				piece_row: () => piece_row,
				piece_column: () => piece_column,
				image_uri: () => uri,
				selected: () => this.selected_index() === slot_index,
				label: () => (this.show_numbers() ? String(piece_index + 1) : ''),
				event_click: () => this.tile_pick(slot_index),
			})
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
				[order[0], order[1]] = [order[1], order[0]]
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
		}

		shuffle_random(base: readonly number[]) {
			const order = [...base]
			for (let index = order.length - 1; index > 0; index--) {
				const swap = Math.floor(Math.random() * (index + 1))
				;[order[index], order[swap]] = [order[swap], order[index]]
			}
			if (this.is_order_solved(order) && order.length > 1) {
				[order[0], order[1]] = [order[1], order[0]]
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
		}

		grid_template_columns() {
			return `repeat(${Math.max(1, this.columns())}, 1fr)`
		}

		grid_template_rows() {
			return `repeat(${Math.max(1, this.rows())}, 1fr)`
		}
	}
}
