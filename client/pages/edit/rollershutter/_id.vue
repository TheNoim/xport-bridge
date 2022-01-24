<template>
    <b-container>
        <b-row>
            <b-col>
                <b-nav>
                    <b-nav-item active to="/">Zurück zur Übersicht</b-nav-item>
                </b-nav>
            </b-col>
        </b-row>
        <div>
            <b-form @submit="onSubmit" v-if="!$fetchState.pending">
                <label for="name">Name</label>
                <b-input v-model="form.name" id="name" required disabled></b-input>
                <p>Nur Buchstaben, Zahlen, - und _. Kein Punkt und auch kein Leerzeichen!</p>

                <label for="description">Beschreibung (Optional)</label>
                <b-textarea v-model="form.description" id="description"></b-textarea>

                <label for="nativeAddress">XPort Adresse</label>
                <b-input v-model="form.nativeAddress" type="number" required id="nativeAddress" number></b-input>

                <label for="nativeChannel">Channel</label>
                <b-select v-model="form.nativeChannel" :options="channelOptions" id="nativeChannel"></b-select>

                <label for="supportsHalf">Unterstützt Hälfte</label>
                <b-select v-model="form.supportsHalf" :options="supportsHalfOptions" id="supportsHalf"></b-select>

                <label for="timeToOpen">Zeit in Bewegung (in Sekunden)</label>
                <b-input v-model="form.timeToOpen" type="number" required id="timeToOpen" number></b-input>

                <b-spinner label="Spinning" v-if="loading"></b-spinner>

                <p v-if="error" v-html="error"></p>

                <b-button type="submit" variant="primary" :disabled="loading">Bearbeiten</b-button>
            </b-form>
        </div>
    </b-container>
</template>

<script>
    const beautify = require("json-beautify");

    export default {
        name: "rollshutter_edit",
        data: () => ({
            form: {
                name: "",
                description: "",
                nativeChannel: 1,
                nativeAddress: null,
                supportsHalf: false,
                timeToOpen: 15,
            },
            error: false,
            channelOptions: [
                { value: 1, text: 'Channel 1' },
                { value: 2, text: 'Channel 2' }
            ],
            supportsHalfOptions: [
                { value: false, text: 'Keine Unterstützung von der Hälfte' },
                { value: true, text: 'Unterstützt Hälfte' }
            ],
            loading: false,
        }),
        async fetch() {
            const data = await this.$axios.$get(`/rollershutter/${this.$route.params.id}`);
            this.form = data;
        },
        methods: {
            onSubmit(evt) {
                evt.preventDefault();
                this.submit().then(() => {
                    this.$router.push('/');
                }).catch(e => {
                    this.loading = false;
                    this.error = e;
                });
            },
            async submit() {
                this.loading = true;

                const resp = await this.$axios.$patch(`/rollershutter/${this.$route.params.id}`, this.form);

                if (resp.error) {
                    throw new Error(beautify(resp));
                }

                this.loading = false;
            }
        }
    }
</script>

<style scoped>

</style>
