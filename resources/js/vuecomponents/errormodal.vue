<template>
    <div class="modal bd-example-modal-lg" 
    style="display: block;background-color: #5d42475e;"
     tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
               <div class="card">
                   <div class="card-header">
                       Error  {{' -> '.error_title}}
                       <span class="close-modal" @click="disMissErrorModal"
                       style="position: relative;left: 90%;font-size: 30px;cursor: pointer;">×</span>
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
            disMissErrorModal()
            {
                this.$emit('close-error-modal')
            }
        },
        props : ['error_text', 'error_title']
    }

</script>
