namespace $.$$ {
	export class $bog_pazzle_board extends $.$bog_pazzle_board {
		@$mol_mem
		image_dimensions() {
			const uri = this.image_uri()
			if (!uri) return null
			const img = this.$.$mol_dom_context.document.createElement('img')
			img.src = uri
			const sync = $mol_wire_sync(img)
			sync.decode()
			return { width: img.naturalWidth, height: img.naturalHeight }
		}

		@$mol_mem
		grid_aspect_ratio() {
			const dim = this.image_dimensions()
			if (!dim) return ''
			return `${dim.width} / ${dim.height}`
		}

		@$mol_mem
		grid_gap() {
			return this.solved() ? '0' : '0.25rem'
		}

		@$mol_mem
		override sub() {
			if (!this.image_present()) return [this.Placeholder()]
			const children: $mol_view[] = [this.Controls(), this.Grid()]
			if (this.solved()) children.push(this.Victory())
			return children
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
			const group = this.tile_groups().get(slot_index) ?? [slot_index]
			const synced = group
				.filter(member => member !== slot_index)
				.map(member => this.tile_instance(member).Drag())
			tile.drags_synced(synced)
			return tile
		}

		tile_instance(slot_index: number) {
			const $ = this.$
			return $.$bog_pazzle_board_tile.make({
				slot_index: $.$mol_const(slot_index),
			})
		}

		slot_coord(slot: number) {
			const columns = Math.max(1, this.columns())
			return {
				row: Math.floor(slot / columns),
				col: slot % columns,
			}
		}

		piece_coord(piece: number) {
			const columns = Math.max(1, this.columns())
			return {
				row: Math.floor(piece / columns),
				col: piece % columns,
			}
		}

		slot_neighbors(slot: number) {
			const neighbors: number[] = []
			const columns = Math.max(1, this.columns())
			const rows = Math.max(1, this.rows())
			const { row, col } = this.slot_coord(slot)
			if (col > 0) neighbors.push(slot - 1)
			if (col + 1 < columns) neighbors.push(slot + 1)
			if (row > 0) neighbors.push(slot - columns)
			if (row + 1 < rows) neighbors.push(slot + columns)
			return neighbors
		}

		slots_aligned(slot_a: number, slot_b: number, order: readonly number[]) {
			const { row: row_a, col: col_a } = this.slot_coord(slot_a)
			const { row: row_b, col: col_b } = this.slot_coord(slot_b)
			const delta_row = row_b - row_a
			const delta_col = col_b - col_a
			if (Math.abs(delta_row) + Math.abs(delta_col) !== 1) return false

			const piece_a = order[slot_a]
			const piece_b = order[slot_b]
			if (piece_a === undefined || piece_b === undefined) return false

			const target_a = this.piece_coord(piece_a)
			const target_b = this.piece_coord(piece_b)

			return target_b.row - target_a.row === delta_row && target_b.col - target_a.col === delta_col
		}

		@$mol_mem
		tile_groups() {
			const order = this.tile_indices()
			const groups = new Map<number, readonly number[]>()
			const visited = new Set<number>()

			for (let slot = 0; slot < order.length; slot++) {
				if (visited.has(slot)) continue
				const group: number[] = []
				const stack = [slot]
				while (stack.length) {
					const current = stack.pop()!
					if (visited.has(current)) continue
					visited.add(current)
					group.push(current)
					for (const neighbor of this.slot_neighbors(current)) {
						if (!visited.has(neighbor) && this.slots_aligned(current, neighbor, order)) stack.push(neighbor)
					}
				}
				const readonly_group = Object.freeze([...group])
				for (const member of readonly_group) groups.set(member, readonly_group)
			}

			return groups
		}

		tile_locked(slot_index: number) {
			const group = this.tile_groups().get(slot_index) ?? [slot_index]
			const order = this.tile_indices()
			return group.every(slot => order[slot] === slot)
		}

		tile_marked(slot_index: number) {
			const selected = this.selected_index()
			const drag_source = this.drag_source_index()
			const drag_hover = this.drag_hover_index()
			const group = this.drag_group_slots()
			const targets = this.drag_target_slots()
			if (group && group.includes(slot_index)) return true
			if (targets && targets.includes(slot_index)) return true
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

		@$mol_mem
		drag_group_slots(next?: readonly number[] | null) {
			if (next !== undefined) return next ?? null
			return null
		}

		@$mol_mem
		drag_target_slots(next?: readonly number[] | null) {
			if (next !== undefined) return next ?? null
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
			if (this.tile_locked(slot_index)) {
				this.drag_source_index(null)
				this.drag_hover_index(null)
				this.drag_group_slots(null)
				this.drag_target_slots(null)
				this.reset_tile_position(slot_index)
				return
			}
			const group = this.tile_groups().get(slot_index) ?? [slot_index]
			this.drag_group_slots(group)
			this.drag_target_slots(group)
			this.drag_source_index(slot_index)
			this.drag_hover_index(slot_index)
			this.selected_index(slot_index)
		}

		@$mol_action
		tile_drag_move(slot_index: number, event: PointerEvent) {
			const source = this.drag_source_index()
			if (source === null || slot_index !== source) return
			const hover = this.slot_index_from_point(event.clientX, event.clientY)
			const group = this.drag_group_slots() ?? [source]
			if (hover === null) {
				this.drag_hover_index(source)
				this.drag_target_slots(group)
				return
			}
			this.drag_hover_index(hover)
			const source_coord = this.slot_coord(source)
			const hover_coord = this.slot_coord(hover)
			const delta_row = hover_coord.row - source_coord.row
			const delta_col = hover_coord.col - source_coord.col
			const dest = this.group_dest_slots(group, delta_row, delta_col)
			this.drag_target_slots(dest ?? group)
		}

		@$mol_action
		tile_drag_end(slot_index: number, event: PointerEvent) {
			const source = this.drag_source_index()
			if (source !== null && slot_index === source) {
				const group = this.drag_group_slots() ?? [source]
				const dest = this.drag_target_slots()
				let moved = false
				if (dest && dest.length === group.length && !this.same_slots(group, dest)) {
					moved = this.apply_group_move(group, dest)
				} else {
					const target = this.slot_index_from_point(event.clientX, event.clientY)
					if (target !== null && target !== source) {
						const order = [...this.tile_indices()]
						;[order[source], order[target]] = [order[target], order[source]]
						this.tile_indices(order)
						moved = true
					}
				}
				if (moved) this.moves(this.moves() + 1)
			}
			this.reset_all_tile_positions()
			this.selected_index(null)
			this.drag_source_index(null)
			this.drag_hover_index(null)
			this.drag_group_slots(null)
			this.drag_target_slots(null)
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
			if (this.tile_locked(slot_index)) {
				this.selected_index(null)
				return
			}
			this.drag_source_index(null)
			this.drag_hover_index(null)
			const current = this.selected_index()
			if (current === null) {
				this.selected_index(slot_index)
				return
			}
			if (this.tile_locked(current)) {
				this.selected_index(null)
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
			this.drag_group_slots(null)
			this.drag_target_slots(null)
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
			this.drag_group_slots(null)
			this.drag_target_slots(null)
			this.reset_all_tile_positions()
		}

		reset_all_tile_positions() {
			const total = this.tile_count()
			for (let slot = 0; slot < total; slot++) {
				this.reset_tile_position(slot)
			}
		}

		group_dest_slots(group: readonly number[], delta_row: number, delta_col: number) {
			const rows = Math.max(1, this.rows())
			const columns = Math.max(1, this.columns())
			const dest: number[] = []
			const set = new Set<number>()
			for (const slot of group) {
				const { row, col } = this.slot_coord(slot)
				const dest_row = row + delta_row
				const dest_col = col + delta_col
				if (dest_row < 0 || dest_row >= rows || dest_col < 0 || dest_col >= columns) return null
				const dest_slot = dest_row * columns + dest_col
				if (set.has(dest_slot)) return null
				set.add(dest_slot)
				dest.push(dest_slot)
			}
			return dest
		}

		same_slots(a: readonly number[], b: readonly number[]) {
			if (a.length !== b.length) return false
			for (let i = 0; i < a.length; i++) {
				if (a[i] !== b[i]) return false
			}
			return true
		}

		apply_group_move(group: readonly number[], dest: readonly number[]) {
			if (dest.length !== group.length) return false
			const order = this.tile_indices()
			const new_order = [...order]
			const group_set = new Set(group)
			const dest_set = new Set(dest)
			if (dest_set.size !== dest.length) return false

			const displaced: number[] = []
			const sources_for_displaced: number[] = []

			for (let i = 0; i < group.length; i++) {
				const src = group[i]
				const dst = dest[i]
				const piece = order[src]
				const occupant = order[dst]
				if (!group_set.has(dst)) displaced.push(occupant)
				new_order[dst] = piece
				if (!dest_set.has(src)) sources_for_displaced.push(src)
			}

			if (displaced.length !== sources_for_displaced.length) return false

			let index = 0
			for (const src of sources_for_displaced) {
				new_order[src] = displaced[index++]
			}

			this.tile_indices(new_order)
			return true
		}

		grid_template_columns() {
			return `repeat(${Math.max(1, this.columns())}, 1fr)`
		}

		grid_template_rows() {
			return `repeat(${Math.max(1, this.rows())}, 1fr)`
		}
	}
}
