<template functional>
    <footer class="the-footer flex-wrap justify-between" :class="classes">
        <span>Sysvent &copy; {{ new Date().getFullYear() }} <a href="http://www.invent.eng.br" target="_blank" rel="nofollow">Invent</a> - Todos os direitos reservados</span>
        <span class="md:flex hidden items-center">
            <span>Versão 1.0</span>
            <feather-icon icon="globe" svgClasses="stroke-current text-danger w-6 h-6" class="ml-2" />
        </span>
    </footer>
</template>

<script>
export default {
    name: "the-footer",
    props: {
        classes: {
            type: String,
        },
    }
}
</script>
