namespace $.$$ {
	export class $bog_pazzle_upload_image extends $.$bog_pazzle_upload_image {
		@$mol_mem
		image_data(next?: Uint8Array | null) {
			if (next !== undefined) return next
			return null as Uint8Array | null
		}

		accept() {
			return 'image/*'
		}

		multiple() {
			return false
		}

		sub() {
			const has_image = !!this.image_uri()
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
	}
}
