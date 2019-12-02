export default class {
    constructor() {
        this.success_title = 'Success';
        this.success_text = null;
        this.visible = false;
    }

    showSuccessModal(success_text='null', success_title='Success!')
    {
        this.success_text = success_text;
        this.success_title = success_title;
        this.visible = true;
    }
    resetSuccessModal()
    {
        this.success_title = "Success";
        this.success_text = 'Success';
        this.visible = false;
    }
}