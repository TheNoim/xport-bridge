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
            <b-form @submit="onSubmit">
                <label for="name">Name</label>
                <b-input v-model="form.name" id="name" required></b-input>
                <p>Nur Buchstaben, Zahlen, - und _. Kein Punkt und auch kein Leerzeichen!</p>

                <label for="description">Beschreibung (Optional)</label>
                <b-textarea v-model="form.description" id="description"></b-textarea>

                <label for="nativeAddress">XPort Adresse</label>
                <b-input v-model="form.nativeAddress" type="number" required id="nativeAddress" number></b-input>

                <label for="nativeChannel">Channel</label>
                <b-select v-model="form.nativeChannel" :options="channelOptions" id="nativeChannel"></b-select>

                <label for="multiChannel">Anzahl an Channel</label>
                <b-select v-model="form.multiChannel" :options="multiChannelOptions" id="multiChannel"></b-select>

                <label for="nativeChannel2" v-if="form.multiChannel">Channel 2</label>
                <b-select v-if="form.multiChannel" v-model="form.nativeChannel2" :options="channelOptions" id="nativeChannel2"></b-select>

                <label for="homeAssistantType" v-if="form.homeAssistantType">Art</label>
                <b-select v-if='form.homeAssistantType' v-model='form.homeAssistantType' :options='homeAssistantTypeOptions' id='homeAssistantType'></b-select>

                <b-spinner label="Spinning" v-if="loading"></b-spinner>

                <p v-if="error" v-html="error"></p>

                <b-button type="submit" variant="primary" :disabled="loading">Erstellen</b-button>
            </b-form>
        </div>
    </b-container>
</template>

<script>
    const beautify = require("json-beautify");

    export default {
        name: "outlet",
        data: () => ({
            form: {
                name: "",
                description: "",
                nativeChannel: 1,
                nativeAddress: null,
                nativeChannel2: 1,
                multiChannel: false,
                homeAssistantType: "switch"
            },
            error: false,
            channelOptions: [
                { value: 1, text: 'Channel 1' },
                { value: 2, text: 'Channel 2' },
                { value: 3, text: 'Channel 3' },
                { value: 4, text: 'Channel 4' }
            ],
            multiChannelOptions: [
                { value: false, text: '1 Channel' },
                { value: true, text: '2 Channel' }
            ],
            homeAssistantTypeOptions: [
                { value: "light", text: "Licht" },
                { value: "switch", text: "Schalter" }
            ],
            loading: false,
        }),
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

                const resp = await this.$axios.$post('/outlet', this.form);

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
