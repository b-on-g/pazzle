namespace $.$$ {
	export class $bog_pazzle_upload extends $.$bog_pazzle_upload {
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
		show_numbers(next?: boolean): boolean {
			return this.Settings().show_numbers(next)
		}

		@$mol_mem
		shuffle_enabled(next?: boolean): boolean {
			return this.Settings().shuffle_enabled(next)
		}
	}
}
