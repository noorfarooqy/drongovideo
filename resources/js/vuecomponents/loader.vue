<template>
    <div class="modal bd-example-modal-lg" style="display: block;background-color: #5d42475e;" tabindex="-1"
        role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content" style="background-color:transparent; border:none">
                <div class="d-flex justify-content-center mt-5">
                    <div class="spinner-border" role="status">
                        <span class="sr-only notext">Loading...</span>
                    </div>

                </div>
                <div class="mt-5 text-center">
                    <h3 class="loading-text" v-if="loading_text === null">Loading...</h3>
                    <h3 class="loading-text" v-else>{{loading_text}}</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                name: 'error modal',
                version: 1,
            }
        },
        methods: {
            disMissErrorModal() {
                this.$emit('close-loader-modal')
            }
        },
        props: ['loading_text']
    }

</script>
