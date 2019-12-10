<template>
    <!-- <div id="app">
        <PDFDocument v-bind="data" />
    </div> -->
    <div class="card">
        <div class="card-header" v-if='isLoading'>
            <div class="loader spinner"> Loading ... {{progress}} % </div>

        </div>
        <div class="card-header alert alert-danger" v-else-if="error.visible">
            {{error.title}}
        </div>
        <div class="card-header" v-else>
            <div style="display: inline-flex;">
                <button class="btn btn-next" @click="previousPage()">
                    << Previous </button> <button class="">{{Document.currentPage}} / {{Document.numPages}}
                </button>
                <button class="btn btn-next" @click="nextPage()"> Next >> </button>
            </div>
        </div>
        <div class="card-body" v-if="error.visible">
            <div class="danger">
                {{error.text}}
            </div>
        </div>
        <div class="card-body" style="border:thick solid gray;" v-else-if="Document.visible">
            <div class="pdf-preview" style="height: 60px;text-align: center;border: thin solid gray;">
                <pdf :src="Document.src" @progress="showProgress" @error="showError" :page="Document.currentPage"
                    style="width:5%; border:thin solid gray; margin-top:10px" :rotate="0">
                </pdf>

            </div>
            <div class="ui-block" style="width:100%">
                <pdf :src="Document.src" :page="Document.currentPage" style="width:inherit"
                    :rotate="Document.currentAngle" @page-loaded="completeLoader" ref="myPdfComponent"></pdf>
            </div>

        </div>
    </div>

</template>

<script>
    import pdf from 'vue-pdf'

    export default {
        data() {
            // console.log('ref created ',this.$refs);
            return {
                inpage: this.page,
                inrotate: this.rotate,
                isLoading: true,
                progress: 0,
                error: {
                    title: null,
                    text: null,
                    visible: false,
                },
                docurl: 'https://drongovideo.local/pdfs/samplepptx (1).pdf',
                Document: {
                    src: null,
                    visible: false,
                    numPages: 0,
                    currentPage: 1,
                    currentAngle: 0,
                },
                loadingTask: null,
            }
        },
        mounted() {
            // this.loadingTask = pdf.createLoadingTask('');
            // this.src = loadingTask;
            // console.log('mounted refs ',this.$refs );
            this.Document.src = pdf.createLoadingTask(this.docurl)
                .then(pdf => {
                    console.log('pdf is ', pdf);
                    this.Document.src = pdf.loadingTask;
                    this.Document.numPages = pdf.numPages;
                    this.Document.visible = true;
                    console.log('refss is ', this.$refs);
                });

            console.log('ref  on mount is ', this.$refs.canvas);
            // var canvas = document.
        },
        created() {
            console.log('ref data ', this.$refs);
        },
        methods: {
            hideLoader() {
                this.isLoading = false;
            },
            showProgress(range) {
                console.log('range is ', range);
                this.progress = range * 100;
            },
            showError(error) {
                console.log('error ', error);
                this.error.text = error.message;
                this.error.title = error.name;
                this.error.visible = true;
                this.isLoading = false;
            },
            previousPage() {
                if (this.Document.currentPage <= 1 || !this.Document.visible)
                    return;
                else
                    this.Document.currentPage -= 1;
                
                this.logContent();
            },
            nextPage() {

                if (this.Document.currentPage >= this.Document.numPages || !this.Document.visible)
                    return;
                else
                    this.Document.currentPage += 1;
                this.logContent();
            },
            showCanvas(canvas) {
                console.log('this canvas ', canvas);
            },
            completeLoader() {
                this.hideLoader();
                // this.
            },
            logContent() {
                console.log('log triggered ',this.$refs.myPdfComponent.pdf);
                this.$refs.myPdfComponent.pdf.forEachPage(function (page) {
                    console.log('page is ',page)
                    return page.getTextContent()
                        .then(function (content) {

                            var text = content.items.map(item => item.str);
                            console.log(text);
                        })
                });
            }
        },
        components: {
            pdf
        }
        // import PDFDocument from "./PDFDocument.vue";
        // export default {

        //     data() {
        //         return {
        //             data: {
        //                 url: 'https://drongovideo.local/pdfs/pdf_tmpl.pdf', // a PDF
        //                 scale: 2,
        //             }
        //         }
        //     },
        //     components: {PDFDocument}
        // }
    }

</script>
