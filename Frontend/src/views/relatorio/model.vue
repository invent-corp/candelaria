<template>
	<div id="page-user-edit">
		<vx-card>
			<div slot="no-body" class="tabs-container px-6 pt-6">

				<vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">

					<vs-tab label="Grid" icon-pack="feather" icon="icon-grid">

					</vs-tab>

					<vs-tab label="Dashboard" icon-pack="feather" icon="icon-pie-chart">

					</vs-tab>

				</vs-tabs>

			</div>
		</vx-card>
	</div>
</template>

<script>

export default {
	data() {
		return {
		activeTab: 0,
		}
	},
	watch: {
	},
	methods: {
	},
	created() {
	}
}

</script>
