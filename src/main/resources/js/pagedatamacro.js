var CLS = {
    name : "pagedatamacro",
    cache : {
       picker : ""
    },
    log : function(msg)
    {
        AJS.log(CLS.name + " : " + msg);
    },
    currentData : function()
    {
        var arr = [];
        // For each macro found on page add data to banner
        $(".pagedataMacro").each(function()
        {
            // capture macro param values
            arr.push($(this).find("input.pagedata").val());
        });
        return arr;
    },
    updateBanner : function(msg)
    {
        // If Banner placeholder hasnt been added yet then add it
        if(! AJS.$("#custombanner").length > 0){
            AJS.$("#full-height-container").prepend("<div id='custombannerplaceholder' class='custombannerplaceholder'></div>");
            AJS.$("#full-height-container").prepend("<div id='custombanner' class='custombanner'></div>");
        }

        AJS.$("#custombanner").html(CLS.currentData().toString());
        CLS.log("Updated banner");
    },
    getPageMacros : function()
    {
        return AJS.$("#wysiwygTextarea_ifr").contents().find("[data-macro-name='"+CLS.name+"']");
    },
    addCheckToSave : function()
    {
           //AJS.Editor.addSaveHandler(function()
           AJS.$("#rte-button-publish").click(function(event)
           {
             if( ! CLS.getPageMacros().length > 0 )
             {
                    event.preventDefault();
                    CLS.log("No macros found on page - redirect to macro create action");
                    AJS.$("[data-macro-name='"+CLS.name+"']").click();
                    return false;
             }
           });
           CLS.log("Added custom save handler");
    },
    picker : function(macro)
    {
        // Configure and cache a custom dialog for our pagedata macro
        if(CLS.cache.picker == ""){
            dialog = new AJS.Dialog(400, 175);
            dialog.addHeader("Page Data");

            var opts = ["1","2","3","4","5","6"];

            var pickerHtml = "<div class='field-group'>";
            pickerHtml += "<select class='select' id='datapicker'>";
            pickerHtml += "<option>Select</option>";
            for(var opt in opts){
                pickerHtml += "<option>"+opts[opt]+"</option>";
            }
            pickerHtml += "</select>";
            pickerHtml += "</div>";

            dialog.addPanel("SinglePanel", pickerHtml, "singlePanel");

            // 2. add macro to editor
            dialog.addSubmit("Save", function () {
                var currentParams = {};
                currentParams["pagedata"] = AJS.$("#datapicker").val();

                // add the macro to the page
                tinymce.confluence.macrobrowser.macroBrowserComplete({"name": CLS.name, "bodyHtml": undefined, "params": currentParams});
                dialog.hide();
            });
            CLS.cache.picker = dialog;
         }

         // If pagedata already on the page then pre select it
        if(macro && macro.params && macro.params.pagedata){
            $("#datapicker").val(macro.params.pagedata);
            CLS.log("preselected pagedata : "+macro.params.pagedata);
        }

        return CLS.cache.picker;
    }
}

AJS.bind("init.rte", function() {
    CLS.log("editor ready");

    // Intercept Save - add check for pagedatamacros
    CLS.addCheckToSave();

    // Override macro edit behaviour with custom dialog
    AJS.MacroBrowser.setMacroJsOverride(CLS.name, {opener: function(macro)
    {
        CLS.picker(macro).show();
    }});
    CLS.log("added custom macro editor");
});