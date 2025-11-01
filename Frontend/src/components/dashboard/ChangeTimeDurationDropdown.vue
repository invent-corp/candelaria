<!-- :class="data.class" -->

<template functional>
    <vs-dropdown vs-trigger-click class="cursor-pointer" :class="data.staticClass">
        <small class="flex cursor-pointer">
          <span>Últimos 7 dias</span>
          <feather-icon icon='ChevronDownIcon' svgClasses='h-4 w-4' class='ml-1' />
        </small>
        <vs-dropdown-menu class="w-32">
            <vs-dropdown-item @click="listeners.timeDurationChanged ? { timeDurationChanged: listeners.timeDurationChanged('last-28-days') } : null">Últimos 30 dias</vs-dropdown-item>
            <vs-dropdown-item @click="listeners.timeDurationChanged ? { timeDurationChanged: listeners.timeDurationChanged('last-month') } : null">Último Mês</vs-dropdown-item>
            <vs-dropdown-item @click="listeners.timeDurationChanged ? { timeDurationChanged: listeners.timeDurationChanged('last-year') } : null">Último Ano</vs-dropdown-item>
        </vs-dropdown-menu>
    </vs-dropdown>
</template>
