<template>
    <div class="">
        <div v-if="Errors.visible" style="
            position: absolute;
            z-index: 9;
            background-color: red;
            padding: 10px;
            width: 250px;
            border: thin solid white;
            border-radius: 10px;
            color: white;
            text-align: center;">
            {{Errors.text}}
            <div class="">
                <button class="btn btn-info" @click.prevent="dismissModel()">OK</button>
            </div>
            </div>
        <div v-else style="
            position: absolute;
            z-index: 9;
            background-color: cadetblue;
            padding: 10px;
            width: 250px;
            border: thin solid white;
            border-radius: 10px;
            color: white;
            text-align: center;">
            <div>
                You are giving out control to the screen.
                All functions will be disabled for you and
                the other user will be given access.
            </div>
            <div class="">
                <button class="btn btn-danger" @click.prevent="dismissModel()">Cancel</button>
                <button class="btn btn-primary" @click.prevent="grantAccess()">Grant Access</button>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                name: 'control',
                version: 1,
            }
        },
        methods: {
            dismissModel() {
                this.$emit('cancel-grant-access');
            },
            grantAccess() {
                this.$emit('grant-access-confirm');
            }
        },
        props: ["Errors"]
    }

</script>
