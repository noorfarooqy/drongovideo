<template>
    <div class="modal bd-example-modal-lg" style="display: block;background-color: #5d42475e;" tabindex="-1"
        role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="card">
                    <div class="card-header " >
                        <span>Troubleshoot </span>
                        <!-- <div class="spinner-border spinner-border-sm ml-3" role="status" v-if="Loading.visible">
                            <span class="sr-only notext">Loading...</span>
                        </div> -->
                        <span class="" @click="disMissErrorModal"
                            style="font-size: 30px;cursor: pointer;position: absolute;right: 20px;top: 0px;">×</span>
                    </div>
                    <div class="card-body">
                        <div class="alert alert-danger" v-for="(error, ekey) in Errors" :key="ekey">
                            <font-awesome-icon :icon="['fas', 'times-circle']" class="mr-4" />
                                {{error.text}}
                            
                        </div>
                        <div class="alert alert-info" v-for="(info, ekey) in Info" :key="ekey">
                            <font-awesome-icon :icon="['fas', 'info']" class="mr-4" />
                            {{info.text}}
                        </div>
                        <div class="alert alert-success" v-for="(success, ekey) in Success" :key="ekey" >
                            <font-awesome-icon :icon="['fas', 'check']" class="mr-4" />
                            {{success.text}}
                        </div>

                        <div class="row">
                            <div class="col-md-2 col-lg-2 col-sm-2 col-xs-2"></div>
                            <button class="col-md-8 col-lg-8 col-sm-8 col-xs-8 btn btn-primary" v-if="Errors.length > 0">
                                 Fix and Reset 
                            </button>
                            <div class="col-md-2 col-lg-2 col-sm-2 col-xs-2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck,faTimesCircle,faInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faCheck,faTimesCircle,faInfo)
    export default {
        data() {
            return {
                name: 'ts',
                version: 1,
                Loading: {
                    visible: false,
                }
            }
        },
        methods: {
            disMissErrorModal() {
                this.$emit('close-troubleshoot-modal')
            }
        },
        props: ["Errors", "Info", "Success"],
        components: {'font-awesome-icon': FontAwesomeIcon}

    }

</script>
