namespace $.$$ {

	export class $bog_pazzle_board_tile extends $.$bog_pazzle_board_tile {

		/** В предпросмотре таскать нечего — снимаем drag-плагин целиком. */
		@ $mol_mem
		override plugins(): readonly $mol_view[] {
			return this.playable() ? super.plugins() : []
		}

		/** Закреплённый фрагмент не сдвигается ни на пиксель. */
		override repos_x( shift: number ) { return this.locked() ? 0 : shift }
		override repos_y( shift: number ) { return this.locked() ? 0 : shift }

		columns_safe() { return Math.max( 1, this.columns() ) }
		rows_safe() { return Math.max( 1, this.rows() ) }

		piece_row() { return Math.floor( this.piece() / this.columns_safe() ) }
		piece_column() { return this.piece() % this.columns_safe() }

		/**
		 * Фон — вся картинка, растянутая на размер сетки и сдвинутая на нужный кусок.
		 * Подсветка и курсор тоже здесь: в таблице стилей `:where` из `@`-блоков веса не добавляет.
		 */
		override style() {

			const style = super.style()
			const rows = this.rows_safe()
			const columns = this.columns_safe()
			const uri = this.image_uri()

			if( uri ) {
				style.backgroundImage = 'url(' + uri + ')'
				style.backgroundSize = columns * 100 + '% ' + rows * 100 + '%'
				style.backgroundPosition =
					( columns === 1 ? 0 : this.piece_column() / ( columns - 1 ) * 100 ) + '% ' +
					( rows === 1 ? 0 : this.piece_row() / ( rows - 1 ) * 100 ) + '%'
			}

			const dragged = this.playable() && this.dragged()

			style.boxShadow = this.selected()
				? 'inset 0 0 0 3px var(--mol_theme_focus)'
				: 'inset 0 0 0 1px var(--mol_theme_line)'

			if( dragged ) style.boxShadow += ', 0 8px 24px #00000066'

			style.cursor = this.playable() && !this.locked() ? ( dragged ? 'grabbing' : 'grab' ) : 'default'

			const x = this.x()
			const y = this.y()
			if( x || y ) style.transform = 'translate(' + x + 'px, ' + y + 'px)'

			if( dragged ) {
				style.zIndex = 10
				// иначе под курсором окажется сам фрагмент, и цель хода не найти
				style.pointerEvents = 'none'
			}

			return style
		}

		override attr() {
			return {
				... super.attr(),
				'data-pazzle-slot': String( this.slot() ),
				bog_pazzle_selected: this.selected(),
				bog_pazzle_playable: this.playable(),
			}
		}

	}

}
