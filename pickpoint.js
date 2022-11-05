function getPickPointWidget(pointName="Доставка PickPoint", addressWrapper="addresses-wrapper") {

    async function pickPointLogin(baseUrl) {
        const loginData = await fetch(`${baseUrl}/login`, {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {"Login": 'hr8Y4q', "Password": '4drd710k4DqUY'}
            )
        })
        const login = await loginData.json()
        return login.SessionId
    }

    async function pickPointGetPricetargetAddress(baseUrl, ikn, targetAddress) {
        let sessionId = getCookie("pickPointSessionId")
        if (!sessionId) {
            sessionId = await pickPointLogin(baseUrl)
            setCookie("pickPointSessionId", sessionId, 1);
        }
        productData = {
         "SessionId": sessionId,
         "IKN": ikn,
         "FromCity": "Уфа",
         "FromRegion": "Башкортостан респ.",
         "ToCity": targetAddress.cityname,
         "ToRegion": targetAddress.region,
         "PTNumber": targetAddress.id,
        }
        let priceData = await fetch(`${baseUrl}/calctariff`,
            {method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(productData)
        })
        const price = await priceData.json()
        if (price.ErrorCode != 0) {
            sessionId = pickPointLogin(baseUrl)
            productData["SessionId"] = sessionId
            priceData = await fetch(`${baseUrl}/calctariff`,
                {method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(productData)
            })
        }
        return price['Services']
    }

    async function callbackPP_function(targetAddress) {
        const ikn = '9991235212'
        const baseUrl='https://e-solution.pickpoint.ru/api'
        $("input[name='tildadelivery-onelineaddress']").val(`${targetAddress.name} (${targetAddress.address})`);
        const prices = await pickPointGetPricetargetAddress(baseUrl, ikn, targetAddress)
        let priceOptions = ''
        let i = 0;
        for (const priceOption of prices) {
            priceOptions += `<br><input type="radio" id="pp_${i}" class="fav_price" name="fav_price" value="${priceOption.Tariff}"><label for="html">${priceOption.Name} (${priceOption.Tariff} р.)</label><br>`
            i += 1;
        }

        const $div = $(priceOptions, {id: "pickpoint_prices", "style": "width: 100%;height: 500px"})
         $( "#pp_prices").html($div)

        if (i > 0) {
            document.getElementById('pp_0').checked = true
            updatePriceForPickerPoint(document.getElementById('pp_0').value)
        }
    }

    $("input[name='tildadelivery-onelineaddress']").prop("readonly", true);
    const ikn = '9991235212'
    const $div = $(`<a href="#" onclick="PickPoint.open(callbackPP_function,{ikn: ${ikn}});return false">Изменить адрес доставки</a>`, {id: "pickpoint_map", "style": "width: 100%;height: 500px"})

    $('.t706__cartwin-totalamount-info').append(
      '<span class="t706__cartwin-totalamount-info_label">' + pointName + ':</span>' +
      '<span class="t706__cartwin-totalamount-info_value" id=\"deliveryValue\">? p.</span>'
    );
    $( "#" + addressWrapper ).prepend($div);
    $( "#" + addressWrapper ).append('<div id="pp_prices"></div>');
    PickPoint.open(callbackPP_function,{ikn: ikn})
    return false;
}