namespace $.$$ {
	export class $bog_pazzle_upload_image extends $.$bog_pazzle_upload_image {
		private _image_data: Uint8Array | null = null
		private _image_uri: string | null = null

		accept() {
			return 'image/*'
		}

		multiple() {
			return false
		}

		@$mol_mem
		image_data(next?: Uint8Array | null) {
			if (next !== undefined) {
				if (this._image_uri) {
					try {
						URL.revokeObjectURL(this._image_uri)
					} catch {}
					this._image_uri = null
				}
				this._image_data = next ?? null
			}
			return this._image_data ?? null
		}

		@$mol_mem
		image_uri() {
			const data = this.image_data()
			if (!data) return ''
			if (!this._image_uri) {
				const blob = new Blob([data], { type: 'image/*' })
				this._image_uri = URL.createObjectURL(blob)
			}
			return this._image_uri
		}

		sub() {
			const has_image = !!this.image_data()
			const view = has_image ? this.Image() : this.Placeholder()
			return [view, this.Native()]
		}

		Image() {
			const $ = this.$
			return $.$mol_image.make({
				title: $mol_const(''),
				uri: () => this.image_uri(),
			})
		}

		Placeholder() {
			const $ = this.$
			return $.$mol_icon_upload.make({})
		}

		@$mol_action
		files(next?: readonly File[]) {
			if (next && next.length) {
				const file = next[0]
				const buffer = new Uint8Array(this.$.$mol_wire_sync(file).arrayBuffer())
				this.image_data(buffer)
			}
			return []
		}

		destructor() {
			super.destructor()
			if (this._image_uri) {
				try {
					URL.revokeObjectURL(this._image_uri)
				} catch {}
				this._image_uri = null
			}
			this._image_data = null
		}
	}
}
