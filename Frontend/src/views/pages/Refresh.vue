<script>

export default {
    methods: {
		loadData() {
			this.$router.go(-1)
		},
    },
    mounted() {
		this.loadData()
	},
}

</script>

