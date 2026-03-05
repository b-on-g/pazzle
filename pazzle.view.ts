namespace $.$$ {
	export class $bog_pazzle extends $.$bog_pazzle {
		@$mol_mem
		image_data(next?: Uint8Array | null) {
			if (next !== undefined) return next
			return null as Uint8Array | null
		}

		private _blob_uri: string | null = null

		@$mol_mem
		image_uri(): string {
			const data = this.image_data()
			if (!data) {
				if (this._blob_uri) {
					URL.revokeObjectURL(this._blob_uri)
					this._blob_uri = null
				}
				return ''
			}
			if (!this._blob_uri) {
				const buffer = data.buffer instanceof ArrayBuffer
					? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
					: data.slice().buffer
				const blob = new Blob([buffer], { type: 'image/*' })
				this._blob_uri = URL.createObjectURL(blob)
			}
			return this._blob_uri
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
