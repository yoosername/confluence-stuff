var CLS = {
    cache : {
        dialog : ""
    },
    name : "pagedatamacro",
    log : function(msg)
    {
        AJS.log(CLS.name + " : " + msg);
    },
    updateBanner : function()
    {
         $(".pagedataMacro").each(function()
         {
             // add page data to header
             var pagedata = $(this).find("input.pagedata").val();
             $("#full-height-container").prepend(pagedata);
         });
         CLS.log("Updated banner");
    },
    macroExists : function()
    {
        return (AJS.$("#wysiwygTextarea_ifr").contents().find("[data-macro-name='"+CLS.name+"']").length > 0);
    },
    addCheckToSave : function()
    {
           AJS.Editor.addSaveHandler(function()
           {
             CLS.log("macro found ? " + CLS.macroExists());
             if( ! CLS.macroExists() )
             {
                    AJS.$("[data-macro-name='"+CLS.name+"']").click();
             }
             return CLS.macroExists();
           });
           CLS.log("Added custom save handler");
    },
    picker : function(macro)
    {
        //CLS.log(macro.params.pagedata);
        // Configure a custom dialog for our pagedata macro
        if(CLS.cache.dialog == ""){
            dialog = new AJS.Dialog(400, 175);
            dialog.addHeader("Page Data");

            var opts = ["OPTION1","OPTION2"];

            var pickerHtml = "<div class='field-group'>";
            pickerHtml += "<select class='select' id='datapicker'>";
            pickerHtml += "<option>Select</option>";
            for(var opt in opts){
                pickerHtml += "<option>"+opts[opt]+"</option>";
            }
            pickerHtml += "</select>";
            pickerHtml += "</div>";

            dialog.addPanel("SinglePanel", pickerHtml, "singlePanel");

            // hide dialog
            //dialog.addCancel("Cancel", function() {
            //    dialog.hide();
            //});

            // 2. add macro to editor
            dialog.addSubmit("Save", function () {
                var currentParams = {};
                currentParams["pagedata"] = AJS.$("#clspicker").val();

                tinymce.confluence.macrobrowser.macroBrowserComplete({"name": CLS.name, "bodyHtml": undefined, "params": currentParams});
                dialog.hide();
            });
            CLS.cache.dialog = dialog;
         }
         // If pagedata already on the page then pre select it

        if(macro && macro.params && macro.params.pagedata){
            $("#datapicker").val(macro.params.pagedata);
            CLS.log("preselect pagedata : "+macro.params.pagedata);
        }

        return CLS.cache.dialog;
    }
}

// but only need to overide save handler when editor is invoked
AJS.$(document).ready(function(){
    CLS.log("dom ready");
    CLS.updateBanner();
});

AJS.bind("init.rte", function() {
    CLS.log("editor ready");

    AJS.MacroBrowser.setMacroJsOverride(CLS.name, {opener: function(macro) {
        // open custom dialog
        CLS.picker(macro).show();
    }});
    CLS.log("added custom macro editor");


    CLS.addCheckToSave();
});