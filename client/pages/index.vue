<template>
    <b-container fluid="xl">
        <div>
            <b-table striped hover :items="outlets" :fields="fieldsOutlet">
                <template v-slot:cell(id)="data">
                    <b-button :to="`/edit/outlet/${data.value}`">Edit</b-button>
                    <b-button
                        variant="error"
                        @click="() => deleteEntity('outlet', data.value)"
                        >Löschen</b-button
                    >
                </template>
            </b-table>
            <b-button to="/create/outlet/">Erstelle eine Steckdose</b-button>
            <b-table
                striped
                hover
                :items="rollershutters"
                :fields="fieldsRollershutters"
            >
                <template v-slot:cell(id)="data">
                    <b-button :to="`/edit/rollershutter/${data.value}`"
                        >Edit</b-button
                    >
                    <b-button
                        variant="error"
                        @click="() => deleteEntity('rollershutter', data.value)"
                        >Löschen</b-button
                    >
                </template>
            </b-table>
            <b-button to="/create/rollershutter/"
                >Erstelle einen Rollershutter</b-button
            >
        </div>
    </b-container>
</template>

<script>
export default {
    name: 'index',
    data: () => ({
        outlets: [],
        fieldsOutlet: [
            {
                key: 'name',
                label: 'Name',
                sortable: true,
            },
            {
                key: 'description',
                label: 'Beschreibung',
            },
            {
                key: 'nativeAddress',
                label: 'Adresse',
                sortable: true,
            },
            {
                key: 'nativeChannel',
                label: 'Channel',
                sortable: true,
            },
            {
                key: 'nativeChannel2',
                label: 'Channel 2',
                sortable: true,
            },
            {
                key: 'multiChannel',
                label: 'Zwei Channel',
                sortable: true,
                formatter: value => (value ? 'Ja' : 'Nein'),
            },
            {
                key: 'homeAssistantType',
                label: 'Art',
                sortable: true,
                formatter: value => {
                    switch (value) {
                        case "light":
                            return "Licht";
                        case "switch":
                            return "Schalter";
                        default:
                            return value;
                    }
                }
            },
            {
                key: 'id',
                label: '',
            },
        ],
        rollershutters: [],
        fieldsRollershutters: [
            {
                key: 'name',
                label: 'Name',
                sortable: true,
            },
            {
                key: 'description',
                label: 'Beschreibung',
            },
            {
                key: 'nativeAddress',
                label: 'Adresse',
                sortable: true,
            },
            {
                key: 'nativeChannel',
                label: 'Channel',
                sortable: true,
            },
            {
                key: 'supportsHalf',
                label: 'Unterstützt Hälfte',
                sortable: true,
                formatter: value => (value ? 'Ja' : 'Nein'),
            },
            {
                key: 'id',
                label: '',
            },
        ],
    }),
    async fetch() {
        await this.loadData();
    },
    methods: {
        async loadData() {
            this.outlets = await this.loadAll('outlet');
            this.rollershutters = await this.loadAll('rollershutter');
        },
        async deleteEntity(what, name) {
            await this.$axios.$delete(`/${what}/${name}`);
            await this.loadData();
        },
        async loadAll(what) {
            const all = [];
            for await (const entity of this.load(what)) {
                all.push({ id: entity.name, ...entity });
            }
            return all;
        },
        async *load(what) {
            let page = 1;
            let count = 10;
            let url = `/${what}`;
            let fetched = 0;
            while (true) {
                const { entities, allEntities } = await this.$axios.$put(url, {
                    count,
                    page,
                });
                fetched += entities.length;
                for (const entity of entities) {
                    yield entity;
                }
                if (fetched >= allEntities) {
                    break;
                } else {
                    page++;
                }
            }
        },
    },
};
</script>

<style scoped></style>
