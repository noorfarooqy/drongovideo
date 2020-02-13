<template lang="pug">
    <div class="panel layout-panel layout-panel-west panel-htop" style="width: 55px; left: 0px; top: 64px;">
        <div id="west" data-options="region:'west', title:'',iconCls:'', split:false, collapsible:false" style="width: 53.0048px; height: 481.995px;" title="" class="panel-body panel-body-noheader layout-body">
            <div class="wr-left">
                <div class="wr-lft-cont column">
                    <div class="sub-default clickDisable" id="lftMainmenu">
                        <a href="javascript:void(0);" id="ancSelect" title="Select Tool">
                            <div class="sub-default-lft"><i class="fa-mouse-pointer"></i></div>
                        </a>
                        <a href="javascript:void(0);" id="ancBackground" title="Background">
                            <div class="sub-default-lft"><i class="fa-circle wbitem"></i></div>
                        </a>
                        <a href="javascript:void(0);" id="ancPattern" title="Pattern">
                            <div class="sub-default-lft"><img src="/whiteboard/images/pattern-icon.png"
                                    style="border:1px solid #ccc;border-radius:60px;"></div>
                        </a>
                        <a href="javascript:void(0);" id="ancPencil" title="Pencil">
                            <div class="sub-default-lft" style="border-right:none;"><i class="fa-pencil wbitem"
                                    style="font-size:120%;"></i></div>
                        </a>
                        <a href="javascript:void(0)" id="ancEraser" title="Eraser">
                            <div class="sub-default-lft"><i class="fa-eraser"></i></div>
                        </a>
                        <a href="javascript:void(0);" id="ancShape" title="Shapes">
                            <div class="sub-default-lft" style="border-right:none;"><img
                                    src="/whiteboard/images/shape-sm.png"></div>
                        </a>
                        <a href="javascript:void(0);" id="ancText" title="Text">
                            <div class="sub-default-lft" style="border-right:none;"><i class="fa-text-height"></i></div>
                        </a>
                        <a href="javascript:void(0);" id="ancImage" title="Image">
                            <div class="sub-default-lft" style="border-right:none;"><i class="fa-file-image-o"></i>
                            </div>
                        </a>

                        <a href="javascript:void(0);" id="ancTutorConnect" title="Tutor Connect Content Presentation">
                            <div class="sub-default-lft" style="border-right:none;"><img
                                    src="/theme/css/icons/image-editor.png"></div>
                        </a>
                        <a href="javascript:void(0);" id="ancStartChat" title="Meeting">
                            <div class="sub-default-lft" style="border-right:none;"><img
                                    src="/theme/css/icons/chat_room.png"></div>
                        </a>
                        <a href="javascript:void(0);" id="ancDownload" title="Download/Upload">
                            <div class="sub-default-lft" style="border-right:none;"><img
                                    src="/whiteboard/images/up-down.png"></div>
                        </a>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: 'leftmenu',
                version: 1
            }
        },
        methods: {

        },

    }

</script>
