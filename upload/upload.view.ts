namespace $.$$ {

	export class $bog_pazzle_upload extends $.$bog_pazzle_upload {

		@ $mol_mem
		upload_content(): readonly $mol_view[] {

			const rows: $mol_view[] = [ this.Image() ]

			if( !this.image_uri() ) {
				rows.push( this.Hint() )
				return rows
			}

			rows.push( this.Settings_title(), this.Settings(), this.Preview_title(), this.Preview(), this.Start() )

			return rows
		}

	}

}
