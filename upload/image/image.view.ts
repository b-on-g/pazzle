namespace $.$$ {

	export class $bog_pazzle_upload_image extends $.$bog_pazzle_upload_image {

		@ $mol_mem
		override sub(): readonly $mol_view_content[] {
			return [ this.image_uri() ? this.Preview() : this.Icon(), this.Native() ]
		}

		@ $mol_action
		override files( next?: readonly File[] ) {
			if( next?.length ) this.picked( next[ 0 ] )
			return []
		}

	}

}
