function getBoxBerryWidget(key, pointName="Доставка Boxberry", addressInputName="tildadelivery-onelineaddress",
                           startCityName="Уфа", weight=4000, height=35, width=35, depth=20,
                           addressWrapper="addresses-wrapper", funcInCallback=()=>{}, funcOutCallback=()=>{}) {
    function callbackBB_function(data) {
        funcInCallback();
        var dcash = parseFloat(data.price);
        window.tcart.delivery.price = dcash;
        var addr = data.name + ": " + data.address;

        if ($('#deliveryValue').length == 0) {
            var pointName = "";
            $('#delivery-services-wrapper > label').each(
                function() {
                    if(this.firstChild.checked) {
                        pointName = this.firstChild.defaultValue;
                    }
                }
            );
            $('.t706__cartwin-totalamount-info').append(
              '<span class="t706__cartwin-totalamount-info_label">' + pointName + ':</span>' +
              '<span class="t706__cartwin-totalamount-info_value" id=\"deliveryValue\">? p.</span>'
            );
        }

        $('#deliveryValue').text(dcash + ' р.');

        $("input[name='tildadelivery-onelineaddress']").val(addr);
        window.tcart.amount = window.tcart.prodamount + dcash;
        $('.t706__cartwin-totalamount').html(window.tcart.amount  + ' р.');
        funcOutCallback();
    }

    $("input[name='tildadelivery-onelineaddress']").prop("readonly", true);
    
    var $div = $("<div>", {id: "boxberry_map",
        "style": "width: 100%;height: 500px"});
        
    $('.t706__cartwin-totalamount-info').append(
      '<span class="t706__cartwin-totalamount-info_label">' + pointName + ':</span>' +
      '<span class="t706__cartwin-totalamount-info_value" id=\"deliveryValue\">? p.</span>'
    );

    $( "#" + addressWrapper ).prepend($div);
    boxberry.openOnPage('boxberry_map');
    boxberry.open(
        callbackBB_function,
        key,
        startCityName,
        "",
        window.tcart.prodamount,  // order price for insurance
        weight,
        0,                        // order was paid in advance
        height, width, depth
    );
    return false;
}