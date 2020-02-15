<template>
    <div class="">
        <div v-if="Errors.visible" class="general_box">
            {{Errors.text}}
            <div class="">
                <button class="btn btn-info" @click.prevent="dismissModel()">OK</button>
            </div>
        </div>
        <div v-else-if="hijack_control" class="general_box">
            Are you sure you want to get back the control without the other giving it back?
            <div class="">
                <button class="btn btn-danger" @click.prevent="dismissModel()">No</button>
                <button class="btn btn-info" @click.prevent="grantAccess(8)">Yes</button>
            </div>
        </div>

        <div v-else-if="request_control" class="general_box request_bg">
            You are requesting to get control of the whiteboard?
            <div class="">
                <button class="btn btn-danger" @click.prevent="dismissModel()">No</button>
                <button class="btn btn-info" @click.prevent="grantAccess(9)">Yes</button>
            </div>
        </div>

        <div v-else-if="show_request" class="general_box request_bg">
            The other user is requesting access to control the whiteboard!
            <div class="">
                <button class="btn btn-danger" @click.prevent="dismissModel(1)">Deny</button>
                <button class="btn btn-primary" @click.prevent="grantAccess(7)">Grant control</button>
            </div>
        </div>
        <div v-else-if="request_denied" class="general_box">
            Your request to access the whiteboard could not be granted.
            <div class="">
                <button class="btn btn-info" @click.prevent="dismissModel()">Ok</button>
            </div>
        </div>
        <div v-else class="general_box cadet_bg">
            <div>
                You are giving out control to the screen.
                All functions will be disabled for you and
                the other user will be given access.
            </div>
            <div class="">
                <button class="btn btn-danger" @click.prevent="dismissModel()">Cancel</button>
                <button class="btn btn-primary" @click.prevent="grantAccess(7)">Grant Access</button>
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
            dismissModel(extra=0) {
                if(extra === 1)
                    this.$emit('deny-grant-extra' ,extra);
                this.$emit('cancel-grant-access');
            },
            grantAccess(accesstype) {
                this.$emit('grant-access-confirm',accesstype);
            }
        },
        props: ["Errors", "hijack_control", "request_control", "show_request", "request_denied"]
    }

</script>
<style scoped>
.general_box {
    position: absolute;
    z-index: 9;
    background-color: red;
    padding: 10px;
    width: 250px;
    border: thin solid white;
    border-radius: 10px;
    color: white;
    text-align: center;
}
.cadet_bg {
    background-color: cadetblue;
}
.request_bg {
    background-color: rgb(192, 230, 174);
    color:black;
}
</style>