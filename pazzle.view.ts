namespace $.$$ {
	export class $bog_pazzle extends $.$bog_pazzle {
		@$mol_mem
		image_uri(): string {
			return this.Image_control().image_uri()
		}

		@$mol_mem
		rows_count(): number {
			return this.Settings().rows_count()
		}

		@$mol_mem
		columns_count(): number {
			return this.Settings().columns_count()
		}

		@$mol_mem
		show_numbers(): boolean {
			return this.Settings().show_numbers()
		}

		@$mol_mem
		shuffle_enabled(): boolean {
			return this.Settings().shuffle_enabled()
		}

		@$mol_mem
		play_moves() {
			return this.Board().moves()
		}

		@$mol_mem
		mode() {
			return this.$.$mol_state_arg.value('mode') ?? ''
		}

		@$mol_mem
		body_content() {
			if (this.mode() === 'play' && this.image_uri()) {
				return [this.Play()]
			}
			return [this.Layout()]
		}
	}
}
