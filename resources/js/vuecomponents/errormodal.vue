<template>
    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
               <div class="card">
                   <div class="card-header">
                       Error  {{' -> '.error_title}}
                   </div>
                   <div class="card-body">
                       {{error_text}}
                   </div>
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

        },
        props : ['error_text', 'error_title']
    }

</script>
