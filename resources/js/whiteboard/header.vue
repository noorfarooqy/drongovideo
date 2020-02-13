<template lang="pug">
    <div class="panel layout-panel layout-panel-north panel-htop" style="width: 1576px; left: 0px; top: 0px;">
        <div data-options="region:'north'" style="overflow: hidden; width: 1574px; height: 63.0048px;" title="" class="panel-body panel-body-noheader layout-body" id="">


            <a href="http://www.tutorialspoint.com/">
                <img src="/images/nlogo.png" height="50px" style="padding:5px; float:left;">
            </a>
            <h1 class="whtboard">Whiteboard</h1>

            <!-- header top right menu first -->
            <div style="margin:18px 0px 0px 0px;">
                <div class="db-nav">
                    <a href="javascript:void(0);" id="ancUndo" title="Undo">
                        <div class="sub-default-lft" style="border-right:none;"><i class="fa-undo wbitem"></i></div>
                    </a>
                    <a href="javascript:void(0);" id="ancRedo" title="Redo">
                        <div class="sub-default-lft" style="border-right:none;"><i class="fa-repeat wbitem"></i></div>
                    </a>
                    <a href="javascript:void(0)" title="Clear all" class="clrDynamicCanvas">
                        <div class="sub-default-lft wbitem" style="border-right:none;"><img
                                src="whiteboard/images/clear.png" style="vertical-align:bottom; height:17px;"></div>
                    </a>
                    <a href="javascript:void(0)" id="maximize" title="Maximize">
                        <div class="sub-default-lft"><i class="fa-expand"></i></div>
                    </a>
                    <a href="javascript:void(0)" id="refresh" title="Refresh Connection">
                        <div class="sub-default-lft"><i class="fa-refresh"></i></div>
                    </a>
                    <a href="javascript:void(0);" id="ancHelpMain" title="Help Whiteboard">
                        <div class="sub-default-lft" style="border-right:none;"><img src="theme/css/icons/help.png">
                        </div>
                    </a>
                </div>
            </div>
            <!-- end of header top right menu first -->

        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: 'whiteboard-header',
            version: 1
        }
    }
}
</script>
