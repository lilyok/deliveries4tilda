// Почта России
function getPochtaWidget(pointName="Отделения и почтоматы", addressInputName="tildadelivery-onelineaddress",
                        addressWrapper="addresses-wrapper", funcInCallback=()=>{}, funcOutCallback=()=>{}){
    $("input[name='" + addressInputName + "']").prop("readonly", true);
    var all = $(".t-input-description").map(function() {
        return this.innerHTML;
    }).get();
    var start_location = all.join('');

    var $div = $("<div>", {id: "ecom-widget",
        "style": "width: 100%;height: 500px"});
        
    $('.t706__cartwin-totalamount-info').append(
      '<span class="t706__cartwin-totalamount-info_label">' + pointName + ':</span>' +
      '<span class="t706__cartwin-totalamount-info_value">? p.</span>'
    );
    funcStr = "function callbackPostCode(data) {"+
        "  funcInCallback();" + 
        "  var dcash = data.cashOfDelivery / 100;" +
        "  window.tcart.delivery.price = dcash;" +
        "  var addr = data.regionTo + ', ' + data.cityTo + ', ' + data.addressTo + ', ' + data.pvzType;" +
        "  $('.t706__cartwin-totalamount-info_value').each(" + 
        "    function(i) {" +
               "if (i==1) this.innerHTML = dcash + ' р.'; i++" +
        "    });"+
        "  window.tcart.amount = window.tcart.prodamount + dcash;" +
        "  $('.t706__cartwin-totalamount').html(" +
                "window.tcart.amount  + ' р.');" +
        "  $(\"input[name='" + addressInputName + "']\").val(" +
        "    addr);" +
        "  funcOutCallback();" +
        "}";
    str = "<script>ecomStartWidget({" +
        "id: 19205," + 
        "callbackFunction: callbackPostCode," +
        "containerId: 'ecom-widget'," + 
        "start_location: '" + start_location + "'," + 
        "});" + funcStr + "<"+  "/script>";

    $div.append(str);
    $( "#" + addressWrapper ).prepend($div);
}