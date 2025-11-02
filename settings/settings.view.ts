namespace $.$$ {
	export class $bog_pazzle_settings extends $.$bog_pazzle_settings {
		@$mol_mem
		rows_count(next?: number) {
			return next ?? 4
		}

		@$mol_mem
		columns_count(next?: number) {
			return next ?? 4
		}

		@$mol_mem
		shuffle_enabled(next?: boolean) {
			return next ?? true
		}

		@$mol_mem
		show_numbers(next?: boolean) {
			return next ?? true
		}
	}
}
