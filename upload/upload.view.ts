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
	}
}
