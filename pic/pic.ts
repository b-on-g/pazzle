namespace $ {

	/** Картинка, ужатая до размеров, которые не жалко положить в localStorage. */
	export type $bog_pazzle_pic = {
		image: string
		thumb: string
		width: number
		height: number
	}

	/** Сторона, в которую вписываем картинку партии. */
	export const $bog_pazzle_pic_side = 900

	/** Сторона миниатюры для списка сохранений. */
	export const $bog_pazzle_pic_side_thumb = 240

	export async function $bog_pazzle_pic_make( this: $, file: Blob ): Promise< $bog_pazzle_pic > {

		const uri = this.$mol_dom_context.URL.createObjectURL( file )

		try {

			const source = new this.$mol_dom_context.Image()
			source.src = uri
			await source.decode()

			return {
				image: this.$bog_pazzle_pic_fit( source, $bog_pazzle_pic_side ),
				thumb: this.$bog_pazzle_pic_fit( source, $bog_pazzle_pic_side_thumb ),
				width: source.naturalWidth,
				height: source.naturalHeight,
			}

		} finally {
			this.$mol_dom_context.URL.revokeObjectURL( uri )
		}

	}

	/** Вписывает картинку в квадрат заданной стороны и отдаёт data-uri. */
	export function $bog_pazzle_pic_fit( this: $, source: HTMLImageElement, side: number ) {

		const scale = Math.min( 1, side / Math.max( 1, source.naturalWidth, source.naturalHeight ) )
		const width = Math.max( 1, Math.round( source.naturalWidth * scale ) )
		const height = Math.max( 1, Math.round( source.naturalHeight * scale ) )

		const canvas = this.$mol_dom_context.document.createElement( 'canvas' )
		canvas.width = width
		canvas.height = height

		const context = canvas.getContext( '2d' )!
		// jpeg не умеет прозрачность — подкладываем белое, иначе png-шки чернеют
		context.fillStyle = '#ffffff'
		context.fillRect( 0, 0, width, height )
		context.drawImage( source, 0, 0, width, height )

		return canvas.toDataURL( 'image/jpeg', 0.78 )

	}

}
