<template>
  <div class="pdf-document">
    <PDFPage
      v-for="page in pages"
      v-bind="{page, scale}"
      :key="page.pageNumber"
    />
  </div>
</template>

<script>
    import PDFPage from "./PDFPage.vue";
    import range from 'lodash/range';
    export default {

        props: ['url', 'scale'],

        data() {
            return {
                pdf: undefined,
                pages: [],
            };
        },
        created() {
            this.fetchPDF();
        },

        methods: {
            fetchPDF() {
                console.log('fetcing pdf ',this.pdf)
                import('pdfjs-dist/webpack').
                then(pdfjs => pdfjs.getDocument(this.url)).
                then(comp_pdf => {
                    this.pdf = comp_pdf;
                    console.log('pdf is ',this.pdf);
                    this.pages = [];
                    const promises = range(1, this.pdf.numPages).
                    map(number => this.pdf.getPage(number));

                    Promise.all(promises).
                    then(pages => (this.pages = pages));
                });
            },
        },
       
        components: {PDFPage}
    }

</script>
