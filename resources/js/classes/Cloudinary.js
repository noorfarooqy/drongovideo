// import cloudinary from 'cloudinary-core';
// window.cloudinary = cloudinary;
export default class {
    constructor()
    {
        this.uploader_options = {
            cloundName: 'Drongo Video System',
            uploadPreset: 'drongo_preset',
        }
        // console.log( cloudinary)
        // this.upload_widget = cloudinary.createUploadWidget({
        //     cloudName: 'my_cloud_name', 
        //     uploadPreset: 'my_preset',
        //     tags: ['pdf', 'ppt'],
        //     sources: ['local','url']
        // },(error => {
        //     console.log('error ',error);
        // }, result => {
        //     console.log('success ',result)
        // }))
    }

    launchUploadWidget()
    {
        // this.upload_widget.open();
    }
}