function getBoxBerryWidget(key, pointName="Доставка Boxberry", addressInputName="tildadelivery-onelineaddress",
                           startCityName="Уфа", weight=4000, height=35, width=35, depth=20,
                           addressWrapper="addresses-wrapper", funcInCallback=()=>{}) {
    function callbackBB_function(data) {
        funcInCallback();
        var dcash = parseFloat(data.price);
        window.tcart.delivery.price = dcash;
        var addr = data.name + ": " + data.address;
        $('.t706__cartwin-totalamount-info_value').each(
            function(i) {
                if (i==1) this.innerHTML = dcash + ' р.';
                i++
        });
        $("input[name='tildadelivery-onelineaddress']").val(addr);
        window.tcart.amount = window.tcart.prodamount + dcash;
        $('.t706__cartwin-totalamount').html(window.tcart.amount  + ' р.');
    }

    $("input[name='tildadelivery-onelineaddress']").prop("readonly", true);
    
    var $div = $("<div>", {id: "boxberry_map",
        "style": "width: 100%;height: 500px"});
        
    $('.t706__cartwin-totalamount-info').append(
      '<span class="t706__cartwin-totalamount-info_label">' + pointName + ':</span>' +
      '<span class="t706__cartwin-totalamount-info_value">? p.</span>'
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